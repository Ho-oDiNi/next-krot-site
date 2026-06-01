"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { isAdminServerSide } from "@/core/auth";
import { removePublicFile } from "@/shared/lib/file-storage";
import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";

export interface DeleteArticleResult {
    success: boolean;
    message: string;
}

export const deleteArticle = async (
    slug: string,
): Promise<DeleteArticleResult> => {
    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        const normalizedSlug = slug.trim();

        if (!normalizedSlug) {
            throw new Error("Не выбран slug статьи для удаления");
        }

        const deletedArticle = await prisma.article.delete({
            where: { slug: normalizedSlug },
            select: {
                slug: true,
                previewImg: true,
            },
        });

        if (deletedArticle.previewImg) {
            await removePublicFile(deletedArticle.previewImg);
        }

        revalidatePath("/admin");
        revalidatePath(`/admin/redactor/article/${deletedArticle.slug}`);
        revalidatePath(`/article/${deletedArticle.slug}`);

        return {
            success: true,
            message: "Статья успешно удалена",
        };
    } catch (error) {
        logger.error("Ошибка при удалении статьи", { error, slug });

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return {
                success: false,
                message: "Статья не найдена",
            };
        }

        return {
            success: false,
            message: error instanceof Error ? error.message : "Ошибка сервера",
        };
    }
};
