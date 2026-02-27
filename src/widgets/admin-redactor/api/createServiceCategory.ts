"use server";

import { Prisma } from "@prisma/client";

import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";
import { Category } from "@/entities/category";
import { isAdminServerSide } from "@/core/auth";
import {
    CATEGORY_IMAGE_MAX_SIZE_BYTES,
    CATEGORY_IMAGE_MAX_SIZE_LABEL,
    saveCategoryImage,
    removePublicFile,
} from "@/shared/lib/file-storage";

export interface CreateServiceCategoryInput {
    name: string;
    slug: string;
    description?: string;
    position?: number;
    imageFile?: File | null;
}

export interface CreateServiceCategoryResult {
    success: boolean;
    message: string;
    category?: Category;
}

export const createServiceCategory = async (
    payload: CreateServiceCategoryInput,
): Promise<CreateServiceCategoryResult> => {
    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        const name = payload.name?.trim();
        const slug = payload.slug?.trim();

        const imageFile =
            typeof File !== "undefined" && payload.imageFile instanceof File
                ? payload.imageFile
                : null;
        const position =
            typeof payload.position === "number" &&
            Number.isFinite(payload.position)
                ? payload.position
                : undefined;

        if (!name) {
            throw new Error("Название категории обязательно");
        }

        if (!slug) {
            throw new Error("Slug категории обязателен");
        }

        let imageUrl: string | undefined;

        if (imageFile && imageFile.size > 0) {
            if (imageFile.size > CATEGORY_IMAGE_MAX_SIZE_BYTES) {
                throw new Error(
                    `Размер изображения не должен превышать ${CATEGORY_IMAGE_MAX_SIZE_LABEL}`,
                );
            }

            imageUrl = await saveCategoryImage(imageFile);
        }

        let createdCategory;

        try {
            createdCategory = await prisma.category.create({
                data: {
                    name,
                    slug,
                    position,
                    imageUrl,
                },
                include: {
                    services: {
                        select: {
                            slug: true,
                        },
                        orderBy: {
                            id: "asc",
                        },
                    },
                },
            });
        } catch (error) {
            if (imageUrl) {
                await removePublicFile(imageUrl);
            }

            throw error;
        }

        const category: Category = {
            id: createdCategory.id,
            slug: createdCategory.slug,
            name: createdCategory.name,
            serviceSlugs: createdCategory.services.map(
                (service) => service.slug,
            ),
            position: createdCategory.position ?? undefined,
        };

        return {
            success: true,
            message: "Категория успешно создана",
            category,
        };
    } catch (error) {
        logger.error("Ошибка при создании категории услуги", {
            error,
            payload,
        });

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                success: false,
                message: "Категория с таким slug уже существует",
            };
        }

        return {
            success: false,
            message: error instanceof Error ? error.message : "Ошибка сервера",
        };
    }
};
