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

export async function addNewService(serviceData: Service): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        const extendedPayload = serviceData as ServiceActionInput;
        const { data, children, comparison } =
            normalizeServicePayload(extendedPayload);

        let categoryId = extendedPayload.categoryId ?? null;

        if (!categoryId && extendedPayload.categorySlug) {
            const category = await prisma.category.findUnique({
                where: { slug: extendedPayload.categorySlug },
                select: { id: true },
            });

            categoryId = category?.id ?? null;
        }

        if (!categoryId) {
            throw new Error("Категория обязательна");
        }

        const createdService = await prisma.$transaction(async (tx) => {
            const created = await tx.service.create({
                data: {
                    ...data,
                    categoryId,
                },
                include: {
                    category: {
                        select: {
                            slug: true,
                        },
                    },
                },
            });

            if (children.whatIncluded.length > 0) {
                await tx.serviceChecklistItem.createMany({
                    data: children.whatIncluded.map(({ text, position }) => ({
                        serviceId: created.id,
                        text,
                        position,
                    })),
                });
            }

            if (children.materials.length > 0) {
                await tx.serviceMaterial.createMany({
                    data: children.materials.map(({ text, position }) => ({
                        serviceId: created.id,
                        text,
                        position,
                    })),
                });
            }

            if (children.faqs.length > 0) {
                await tx.serviceFaq.createMany({
                    data: children.faqs.map(
                        ({ question, answer, position }) => ({
                            serviceId: created.id,
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
                    where: { serviceId: created.id },
                    create: {
                        serviceId: created.id,
                        ...normalizedComparison,
                    },
                    update: normalizedComparison,
                });
            }

            return created;
        });

        await revalidateServicePaths([
            {
                categorySlug: createdService.category?.slug,
                slug: createdService.slug,
            },
        ]);

        return {
            success: true,
            message: "Услуга успешно создана",
        };
    } catch (error) {
        logger.error("Ошибка при добавлении услуги", {
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
