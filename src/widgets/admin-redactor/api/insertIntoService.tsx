"use server";

import { Prisma } from "@prisma/client";

import { Service } from "@/entities/service";
import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";

import {
    normalizeServicePayload,
    ServiceActionInput,
} from "../servicePayload.utils";
import { revalidateServicePaths } from "../serviceRevalidate.utils";
import { isAdminServerSide } from "@/core/auth";

export async function insertIntoService(serviceData: Service): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const isAdmin = await isAdminServerSide();
        if (!isAdmin) throw new Error("Ошибка авторизации");

        if (!Number.isInteger(serviceData.id) || serviceData.id <= 0) {
            throw new Error("Идентификатор услуги обязателен");
        }

        const extendedPayload = serviceData as ServiceActionInput;
        const { data, children, comparison } =
            normalizeServicePayload(extendedPayload);

        const existingService = await prisma.service.findUnique({
            where: { id: serviceData.id },
            include: {
                category: {
                    select: {
                        slug: true,
                    },
                },
            },
        });

        if (!existingService) {
            throw new Error("Услуга не найдена");
        }

        let nextCategoryId: number | null =
            extendedPayload.categoryId ?? existingService.categoryId;

        if (!nextCategoryId && extendedPayload.categorySlug) {
            const category = await prisma.category.findUnique({
                where: { slug: extendedPayload.categorySlug },
                select: { id: true },
            });

            nextCategoryId = category?.id ?? null;
        }

        if (!nextCategoryId) {
            throw new Error("Категория обязательна");
        }

        const serviceId = existingService.id;

        const updatedService = await prisma.$transaction(async (tx) => {
            const updated = await tx.service.update({
                where: { id: serviceId },
                data: {
                    ...data,
                    categoryId: nextCategoryId,
                },
                include: {
                    category: {
                        select: {
                            slug: true,
                        },
                    },
                },
            });

            await tx.serviceChecklistItem.deleteMany({
                where: { serviceId },
            });

            await tx.serviceMaterial.deleteMany({
                where: { serviceId },
            });

            await tx.serviceFaq.deleteMany({
                where: { serviceId },
            });

            if (children.whatIncluded.length > 0) {
                await tx.serviceChecklistItem.createMany({
                    data: children.whatIncluded.map(({ text, position }) => ({
                        serviceId,
                        text,
                        position,
                    })),
                });
            }

            if (children.materials.length > 0) {
                await tx.serviceMaterial.createMany({
                    data: children.materials.map(({ text, position }) => ({
                        serviceId,
                        text,
                        position,
                    })),
                });
            }

            if (children.faqs.length > 0) {
                await tx.serviceFaq.createMany({
                    data: children.faqs.map(
                        ({ question, answer, position }) => ({
                            serviceId,
                            question,
                            answer,
                            position,
                        }),
                    ),
                });
            }

            if (comparison) {
                const normalizedComparison = {
                    ...comparison,
                    beforeImageAlt: comparison.beforeImageAlt ?? "",
                    afterImageAlt: comparison.afterImageAlt ?? "",
                };

                await tx.serviceComparison.upsert({
                    where: { serviceId },
                    create: {
                        serviceId,
                        ...normalizedComparison,
                    },
                    update: normalizedComparison,
                });
            } else {
                await tx.serviceComparison.deleteMany({
                    where: { serviceId },
                });
            }

            return updated;
        });

        await revalidateServicePaths([
            {
                categorySlug: existingService.category?.slug,
                slug: existingService.slug,
            },
            {
                categorySlug: updatedService.category?.slug,
                slug: updatedService.slug,
            },
        ]);

        return {
            success: true,
            message: "Данные успешно сохранены",
        };
    } catch (error) {
        logger.error("Ошибка при сохранении услуги", {
            error,
            serviceData,
        });

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                success: false,
                message: "Услуга с таким slug уже существует",
            };
        }

        return {
            success: false,
            message: error instanceof Error ? error.message : "Ошибка сервера",
        };
    }
}
