"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { isAdminServerSide } from "@/core/auth";
import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";
import type {
    UpdateArticlePayload,
    UpdateArticleResult,
} from "@/widgets/admin-article-redactor/model";

const normalizeNullableString = (value: string | null) => {
    const trimmedValue = value?.trim();

    return trimmedValue ? trimmedValue : null;
};

const normalizeArticlePayload = (payload: UpdateArticlePayload) => {
    const slug = payload.slug.trim();
    const title = payload.title.trim();
    const mainText = payload.mainText.trim();

    if (!payload.originalSlug.trim()) {
        throw new Error("Не найден исходный slug статьи");
    }

    if (!slug) {
        throw new Error("Slug статьи обязателен");
    }

    if (!title) {
        throw new Error("Название статьи обязательно");
    }

    if (!mainText) {
        throw new Error("Текст статьи обязателен");
    }

    return {
        originalSlug: payload.originalSlug.trim(),
        data: {
            slug,
            title,
            previewImg: normalizeNullableString(payload.previewImg),
            mainText,
            readingTime: payload.readingTime,
            isPublished: payload.isPublished,
        },
    };
};

export const updateArticle = async (
    payload: UpdateArticlePayload,
): Promise<UpdateArticleResult> => {
    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        const { originalSlug, data } = normalizeArticlePayload(payload);

        const updatedArticle = await prisma.article.update({
            where: { slug: originalSlug },
            data,
            select: {
                slug: true,
            },
        });

        revalidatePath("/admin");
        revalidatePath(`/admin/redactor/article/${originalSlug}`);
        revalidatePath(`/admin/redactor/article/${updatedArticle.slug}`);
        revalidatePath(`/article/${originalSlug}`);
        revalidatePath(`/article/${updatedArticle.slug}`);

        return {
            success: true,
            message: "Статья успешно сохранена",
            slug: updatedArticle.slug,
        };
    } catch (error) {
        logger.error("Ошибка при сохранении статьи", {
            error,
            payload,
        });

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                success: false,
                message: "Статья с таким slug уже существует",
            };
        }

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
