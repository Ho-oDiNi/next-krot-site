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

const MOSCOW_TIME_ZONE = "Europe/Moscow";
const MOSCOW_UTC_OFFSET_HOURS = 3;
const MOSCOW_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

const parseMoscowDateTime = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const matchedDateTime = trimmedValue.match(MOSCOW_DATE_TIME_PATTERN);

    if (!matchedDateTime) {
        throw new Error("Укажите дату и время публикации в корректном формате");
    }

    const [, year, month, day, hour, minute] = matchedDateTime.map(Number);
    const utcTimestamp = Date.UTC(
        year,
        month - 1,
        day,
        hour - MOSCOW_UTC_OFFSET_HOURS,
        minute,
    );

    const parsedDate = new Date(utcTimestamp);

    const normalizedMoscowValue = new Intl.DateTimeFormat("ru-RU", {
        timeZone: MOSCOW_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
        .formatToParts(parsedDate)
        .reduce<Record<string, string>>((dateParts, part) => {
            dateParts[part.type] = part.value;
            return dateParts;
        }, {});

    const normalizedDateTime = `${normalizedMoscowValue.year}-${normalizedMoscowValue.month}-${normalizedMoscowValue.day}T${normalizedMoscowValue.hour}:${normalizedMoscowValue.minute}`;

    if (
        Number.isNaN(parsedDate.getTime()) ||
        normalizedDateTime !== trimmedValue
    ) {
        throw new Error("Укажите корректную дату публикации");
    }

    return parsedDate;
};

const normalizeNullableString = (value: string | null) => {
    const trimmedValue = value?.trim();

    return trimmedValue ? trimmedValue : null;
};

const getPublicationDateForSave = (
    isPublished: boolean,
    publishedAt: Date | null,
) => {
    if (!isPublished || !publishedAt) {
        return publishedAt;
    }

    if (publishedAt.getTime() < Date.now()) {
        throw new Error(
            "Отложенная публикация не может быть раньше текущего времени",
        );
    }

    return publishedAt;
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
    const metaTitle = payload.metaTitle.trim();
    const metaDescription = payload.metaDescription.trim();
    const mainText = payload.mainText.trim();
    const previewImageFile = getArticlePreviewImageFile(payload);
    const publishedAt = parseMoscowDateTime(payload.publishedAtMoscow);
    const uniqueTagIds = Array.from(new Set(payload.tagIds));

    if (!slug) {
        throw new Error("Slug статьи обязателен");
    }

    if (!title) {
        throw new Error("Название статьи обязательно");
    }

    if (!mainText) {
        throw new Error("Текст статьи обязателен");
    }

    if (!payload.authorId) {
        throw new Error("Выберите автора статьи");
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
        originalSlug: payload.originalSlug?.trim() || null,
        data: {
            slug,
            title,
            metaTitle,
            metaDescription,
            previewImg: normalizeNullableString(payload.previewImg),
            mainText,
            readingTime: calculateReadingTime(mainText),
            isPublished: payload.isPublished,
            publishedAt: getPublicationDateForSave(
                payload.isPublished,
                publishedAt,
            ),
            authorId: payload.authorId,
            tags: {
                set: uniqueTagIds.map((id) => ({ id })),
            },
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

        const existingArticle = originalSlug
            ? await prisma.article.findUnique({
                  where: { slug: originalSlug },
                  select: { previewImg: true },
              })
            : null;

        if (originalSlug && !existingArticle) {
            throw new Error("Статья не найдена");
        }

        if (previewImageFile && previewImageFile.size > 0) {
            uploadedPreviewImageUrl = await savePublicImage(previewImageFile);
        }

        const articleData = {
            ...data,
            previewImg: uploadedPreviewImageUrl ?? data.previewImg,
        };

        const savedArticle = originalSlug
            ? await prisma.article.update({
                  where: { slug: originalSlug },
                  data: articleData,
                  select: { slug: true },
              })
            : await prisma.article.create({
                  data: {
                      ...articleData,
                      tags: {
                          connect: data.tags.set,
                      },
                  },
                  select: { slug: true },
              });

        if (uploadedPreviewImageUrl && existingArticle?.previewImg) {
            await removePublicFile(existingArticle.previewImg);
        }

        revalidatePath("/admin");
        revalidatePath("/admin/redactor/article");
        revalidatePath(`/admin/redactor/article/${savedArticle.slug}`);
        revalidatePath(`/article/${savedArticle.slug}`);

        if (originalSlug) {
            revalidatePath(`/admin/redactor/article/${originalSlug}`);
            revalidatePath(`/article/${originalSlug}`);
        }

        return {
            success: true,
            message: originalSlug
                ? "Статья успешно сохранена"
                : "Статья успешно создана",
            slug: savedArticle.slug,
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
