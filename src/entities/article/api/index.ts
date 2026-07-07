import { prisma } from "@/shared/lib/prisma";
import { ArticleWithRelations } from "../model";
import { getPublishedArticleWhere } from "../lib";

const clearPublishedScheduleDates = async () => {
    await prisma.article.updateMany({
        where: {
            isPublished: true,
            publishedAt: { lte: new Date() },
        },
        data: {
            publishedAt: null,
        },
    });
};

interface GetArticlesParams {
    page: number;
    limit: number;
    filters?: {
        authorId?: number;
        tagId?: number;
    };
    isPublished?: boolean;
}

export const getArticles = async ({
    page,
    limit,
    filters,
    isPublished,
}: GetArticlesParams) => {
    await clearPublishedScheduleDates();

    return prisma.article.findMany({
        where: {
            authorId: filters?.authorId,
            tags: filters?.tagId
                ? {
                      some: {
                          id: filters.tagId,
                      },
                  }
                : undefined,
            ...(isPublished === true
                ? getPublishedArticleWhere()
                : { isPublished }),
        },
        include: {
            author: true,
            tags: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
            { isPublished: "asc" },
            { publishedAt: "desc" },
            { updatedAt: "desc" },
        ],
    });
};

export const getArticleBySlug = async (
    slug: string,
    onlyAvailable = false,
): Promise<ArticleWithRelations | null> => {
    await clearPublishedScheduleDates();

    return prisma.article.findFirst({
        where: {
            slug,
            ...(onlyAvailable ? getPublishedArticleWhere() : {}),
        },
        include: {
            author: true,
            tags: true,
        },
    });
};

export const getAllPublishedArticles = async () => {
    await clearPublishedScheduleDates();

    return prisma.article.findMany({
        where: getPublishedArticleWhere(),
        select: {
            slug: true,
            updatedAt: true,
        },
        orderBy: {
            publishedAt: "desc",
        },
    });
};
