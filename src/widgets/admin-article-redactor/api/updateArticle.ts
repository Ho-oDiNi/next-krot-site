"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { isAdminServerSide } from "@/core/auth";
import {
    PUBLIC_IMAGE_MAX_SIZE_BYTES,
    PUBLIC_IMAGE_MAX_SIZE_LABEL,
    removePublicFile,
    savePublicImage,
} from "@/shared/lib/file-storage";
import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";
import type {
    UpdateArticlePayload,
    UpdateArticleResult,
} from "@/widgets/admin-article-redactor/model";

const READING_CHARACTERS_PER_MINUTE = 1400;

const normalizeNullableString = (value: string | null) => {
    const trimmedValue = value?.trim();

    return trimmedValue ? trimmedValue : null;
};

const calculateReadingTime = (mainText: string): number =>
    Math.max(1, Math.ceil(mainText.length / READING_CHARACTERS_PER_MINUTE));

const getArticlePreviewImageFile = (payload: UpdateArticlePayload) =>
    typeof File !== "undefined" && payload.previewImageFile instanceof File
        ? payload.previewImageFile
        : null;

const normalizeArticlePayload = (payload: UpdateArticlePayload) => {
    const slug = payload.slug.trim();
    const title = payload.title.trim();
    const mainText = payload.mainText.trim();
    const previewImageFile = getArticlePreviewImageFile(payload);

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

    if (
        previewImageFile &&
        previewImageFile.size > PUBLIC_IMAGE_MAX_SIZE_BYTES
    ) {
        throw new Error(
            `Размер изображения не должен превышать ${PUBLIC_IMAGE_MAX_SIZE_LABEL}`,
        );
    }

    return {
        originalSlug: payload.originalSlug.trim(),
        data: {
            slug,
            title,
            previewImg: normalizeNullableString(payload.previewImg),
            mainText,
            readingTime: calculateReadingTime(mainText),
            isPublished: payload.isPublished,
        },
        previewImageFile,
    };
};

export const updateArticle = async (
    payload: UpdateArticlePayload,
): Promise<UpdateArticleResult> => {
    let uploadedPreviewImageUrl: string | undefined;

    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        const { originalSlug, data, previewImageFile } =
            normalizeArticlePayload(payload);

        const existingArticle = await prisma.article.findUnique({
            where: { slug: originalSlug },
            select: { previewImg: true },
        });

        if (!existingArticle) {
            throw new Error("Статья не найдена");
        }

        if (previewImageFile && previewImageFile.size > 0) {
            uploadedPreviewImageUrl = await savePublicImage(previewImageFile);
        }

        const updatedArticle = await prisma.article.update({
            where: { slug: originalSlug },
            data: {
                ...data,
                previewImg: uploadedPreviewImageUrl ?? data.previewImg,
            },
            select: {
                slug: true,
            },
        });

        if (uploadedPreviewImageUrl && existingArticle.previewImg) {
            await removePublicFile(existingArticle.previewImg);
        }

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
        if (uploadedPreviewImageUrl) {
            await removePublicFile(uploadedPreviewImageUrl);
        }

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
