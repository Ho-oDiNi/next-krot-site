"use server";

import { Prisma } from "@prisma/client";

import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";
import {
    CategoryUpdatePayload,
    CategoryUpdateResult,
} from "../model/adminRedactor.types";
import { isAdminServerSide } from "@/core/auth";
import { Category } from "@/entities/category";
import {
    CATEGORY_IMAGE_MAX_SIZE_BYTES,
    CATEGORY_IMAGE_MAX_SIZE_LABEL,
    saveCategoryImage,
    removePublicFile,
} from "@/shared/lib/file-storage";

const mapCategory = (category: {
    id: number;
    slug: string;
    name: string;
    imageUrl: string | null;
    position: number;
    services: Array<{ slug: string }>;
}): Category => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    imageUrl: category.imageUrl ?? undefined,
    position: category.position ?? undefined,
    serviceSlugs: category.services.map((service) => service.slug),
});

export const updateServiceCategory = async (
    payload: CategoryUpdatePayload,
): Promise<CategoryUpdateResult> => {
    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        const categoryId = Number(payload.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            throw new Error("Некорректный идентификатор категории");
        }

        const name = payload.name?.trim();
        const slug = payload.slug?.trim();
        const hasPosition =
            typeof payload.position === "number" &&
            Number.isFinite(payload.position);
        const imageFile =
            typeof File !== "undefined" && payload.imageFile instanceof File
                ? payload.imageFile
                : null;

        if (!name) {
            throw new Error("Название категории обязательно");
        }

        if (!slug) {
            throw new Error("Slug категории обязателен");
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
            select: {
                imageUrl: true,
            },
        });

        if (!existingCategory) {
            throw new Error("Категория не найдена");
        }

        let newImageUrl: string | undefined;

        if (imageFile && imageFile.size > 0) {
            if (imageFile.size > CATEGORY_IMAGE_MAX_SIZE_BYTES) {
                throw new Error(
                    `Размер изображения не должен превышать ${CATEGORY_IMAGE_MAX_SIZE_LABEL}`,
                );
            }

            newImageUrl = await saveCategoryImage(imageFile);
        }

        let updatedCategory;

        try {
            updatedCategory = await prisma.category.update({
                where: { id: categoryId },
                data: {
                    name,
                    slug,
                    position: hasPosition ? payload.position : undefined,
                    imageUrl: newImageUrl ?? existingCategory.imageUrl,
                },
                include: {
                    services: {
                        select: { slug: true },
                        orderBy: { id: "asc" },
                    },
                },
            });
        } catch (error) {
            if (newImageUrl) {
                await removePublicFile(newImageUrl);
            }

            throw error;
        }

        if (newImageUrl && existingCategory.imageUrl) {
            await removePublicFile(existingCategory.imageUrl);
        }

        const category = mapCategory(updatedCategory);

        return {
            success: true,
            message: "Категория успешно обновлена",
            category,
        } satisfies CategoryUpdateResult;
    } catch (error) {
        logger.error("Ошибка при обновлении категории услуги", {
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
            } satisfies CategoryUpdateResult;
        }

        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            } satisfies CategoryUpdateResult;
        }

        return {
            success: false,
            message: "Ошибка сервера",
        } satisfies CategoryUpdateResult;
    }
};
