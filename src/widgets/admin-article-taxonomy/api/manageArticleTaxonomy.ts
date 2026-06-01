"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { isAdminServerSide } from "@/core/auth";
import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";
import type {
    ArticleTaxonomyFormData,
    ArticleTaxonomyResult,
} from "@/widgets/admin-article-taxonomy/model";

const ARTICLE_TAXONOMY_REVALIDATE_PATHS = [
    "/admin",
    "/article",
    "/author",
    "/tag",
];

const requiredString = (value: string | undefined, message: string) => {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        throw new Error(message);
    }

    return trimmedValue;
};

const normalizeTaxonomyPayload = (payload: ArticleTaxonomyFormData) => ({
    id: payload.id,
    name: requiredString(payload.name, "Название обязательно"),
    slug: requiredString(payload.slug, "Slug обязателен"),
    description: payload.description?.trim() ?? "",
    avatarImg: payload.avatarImg?.trim() || null,
});

const ensureAdmin = async () => {
    const isAdmin = await isAdminServerSide();

    if (!isAdmin) {
        throw new Error("Ошибка авторизации");
    }
};

const revalidateArticleTaxonomy = () => {
    ARTICLE_TAXONOMY_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
};

const getPrismaErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return "Запись с таким slug уже существует";
        }

        if (error.code === "P2003") {
            return "Нельзя удалить запись, которая используется в статьях";
        }

        if (error.code === "P2025") {
            return "Запись не найдена";
        }
    }

    return error instanceof Error ? error.message : fallbackMessage;
};

export const createArticleAuthor = async (
    payload: ArticleTaxonomyFormData,
): Promise<ArticleTaxonomyResult> => {
    try {
        await ensureAdmin();
        const data = normalizeTaxonomyPayload(payload);
        const author = await prisma.author.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                avatarImg: data.avatarImg,
            },
        });

        revalidateArticleTaxonomy();

        return {
            success: true,
            message: "Автор успешно добавлен",
            author,
        };
    } catch (error) {
        logger.error("Ошибка при добавлении автора статьи", { error, payload });

        return {
            success: false,
            message: getPrismaErrorMessage(error, "Ошибка добавления автора"),
        };
    }
};

export const updateArticleAuthor = async (
    payload: ArticleTaxonomyFormData,
): Promise<ArticleTaxonomyResult> => {
    try {
        await ensureAdmin();
        const data = normalizeTaxonomyPayload(payload);

        if (!data.id) {
            throw new Error("Не найден автор для обновления");
        }

        const author = await prisma.author.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                avatarImg: data.avatarImg,
            },
        });

        revalidateArticleTaxonomy();
        revalidatePath(`/author/${author.slug}`);

        return {
            success: true,
            message: "Автор успешно обновлён",
            author,
        };
    } catch (error) {
        logger.error("Ошибка при обновлении автора статьи", { error, payload });

        return {
            success: false,
            message: getPrismaErrorMessage(error, "Ошибка обновления автора"),
        };
    }
};

export const deleteArticleAuthor = async (
    id: number,
): Promise<ArticleTaxonomyResult> => {
    try {
        await ensureAdmin();
        const author = await prisma.author.delete({ where: { id } });

        revalidateArticleTaxonomy();
        revalidatePath(`/author/${author.slug}`);

        return {
            success: true,
            message: "Автор успешно удалён",
            id,
        };
    } catch (error) {
        logger.error("Ошибка при удалении автора статьи", { error, id });

        return {
            success: false,
            message: getPrismaErrorMessage(error, "Ошибка удаления автора"),
        };
    }
};

export const createArticleTag = async (
    payload: ArticleTaxonomyFormData,
): Promise<ArticleTaxonomyResult> => {
    try {
        await ensureAdmin();
        const data = normalizeTaxonomyPayload(payload);
        const tag = await prisma.tag.create({
            data: {
                name: data.name,
                slug: data.slug,
            },
        });

        revalidateArticleTaxonomy();

        return {
            success: true,
            message: "Тема успешно добавлена",
            tag,
        };
    } catch (error) {
        logger.error("Ошибка при добавлении темы статьи", { error, payload });

        return {
            success: false,
            message: getPrismaErrorMessage(error, "Ошибка добавления темы"),
        };
    }
};

export const updateArticleTag = async (
    payload: ArticleTaxonomyFormData,
): Promise<ArticleTaxonomyResult> => {
    try {
        await ensureAdmin();
        const data = normalizeTaxonomyPayload(payload);

        if (!data.id) {
            throw new Error("Не найдена тема для обновления");
        }

        const tag = await prisma.tag.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: data.slug,
            },
        });

        revalidateArticleTaxonomy();
        revalidatePath(`/tag/${tag.slug}`);

        return {
            success: true,
            message: "Тема успешно обновлена",
            tag,
        };
    } catch (error) {
        logger.error("Ошибка при обновлении темы статьи", { error, payload });

        return {
            success: false,
            message: getPrismaErrorMessage(error, "Ошибка обновления темы"),
        };
    }
};

export const deleteArticleTag = async (
    id: number,
): Promise<ArticleTaxonomyResult> => {
    try {
        await ensureAdmin();
        const tag = await prisma.tag.delete({ where: { id } });

        revalidateArticleTaxonomy();
        revalidatePath(`/tag/${tag.slug}`);

        return {
            success: true,
            message: "Тема успешно удалена",
            id,
        };
    } catch (error) {
        logger.error("Ошибка при удалении темы статьи", { error, id });

        return {
            success: false,
            message: getPrismaErrorMessage(error, "Ошибка удаления темы"),
        };
    }
};
