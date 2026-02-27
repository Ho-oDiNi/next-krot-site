"use server";

import { Prisma } from "@prisma/client";

import { Service } from "@/entities/service";
import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";

import { normalizeServicePayload } from "../servicePayload.utils";
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

        const { data } = normalizeServicePayload(serviceData);

        const fallbackCategory = await prisma.category.findFirst({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                slug: true,
            },
        });

        if (!fallbackCategory) {
            throw new Error("Не найдена категория для новой услуги");
        }

        const createdService = await prisma.service.create({
            data: {
                ...data,
                categoryId: fallbackCategory.id,
                price: 0,
                priceAbbr: "",
            },
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
