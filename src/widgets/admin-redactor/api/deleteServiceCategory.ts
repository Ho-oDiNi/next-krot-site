"use server";

import { Prisma } from "@prisma/client";

import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";
import { CategoryDeleteResult } from "../model/adminRedactor.types";
import { isAdminServerSide } from "@/core/auth";
import { removePublicFile } from "@/shared/lib/file-storage";

export const deleteServiceCategory = async (
    categoryId: number,
): Promise<CategoryDeleteResult> => {
    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        const id = Number(categoryId);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("Некорректный идентификатор категории");
        }

        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                imageUrl: true,
            },
        });

        if (!category) {
            throw new Error("Категория не найдена");
        }

        await prisma.category.delete({
            where: { id },
        });

        try {
            await removePublicFile(category.imageUrl);
        } catch (fileError) {
            logger.error("Не удалось удалить изображение категории", {
                fileError,
                categoryId: id,
                imageUrl: category.imageUrl,
            });

            return {
                success: false,
                message: "Категория удалена, но не удалось удалить изображение",
                categoryId: id,
            } satisfies CategoryDeleteResult;
        }

        return {
            success: true,
            message: "Категория удалена",
            categoryId: id,
        } satisfies CategoryDeleteResult;
    } catch (error) {
        logger.error("Ошибка при удалении категории услуги", {
            error,
            categoryId,
        });

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
        ) {
            return {
                success: false,
                message:
                    "Сначала удалите или перенесите услуги, связанные с категорией",
            } satisfies CategoryDeleteResult;
        }

        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            } satisfies CategoryDeleteResult;
        }

        return {
            success: false,
            message: "Ошибка сервера",
        } satisfies CategoryDeleteResult;
    }
};
