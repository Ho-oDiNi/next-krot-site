import { prisma } from "@/shared/lib/prisma";
import { ArticleWithRelations } from "../model";
import { getPublishedArticleWhere } from "../lib";

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
