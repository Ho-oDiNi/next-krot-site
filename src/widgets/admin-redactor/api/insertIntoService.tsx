"use server";

import { Prisma } from "@prisma/client";

import { Service } from "@/entities/service";
import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";

import { normalizeServicePayload } from "../servicePayload.utils";
import { revalidateServicePaths } from "../serviceRevalidate.utils";
import { isAdminServerSide } from "@/core/auth";

export async function insertIntoService(serviceData: Service): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const isAdmin = await isAdminServerSide();
        if (!isAdmin) throw new Error("Ошибка авторизации");

        const { data } = normalizeServicePayload(serviceData);

        const existingService = await prisma.service.findUnique({
            where: { slug: serviceData.slug },
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

        const updatedService = await prisma.service.update({
            where: { id: existingService.id },
            data,
            include: {
                category: {
                    select: {
                        slug: true,
                    },
                },
            },
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
