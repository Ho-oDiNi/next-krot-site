import { prisma } from "@/shared/lib/prisma";
import { ArticleWithRelations } from "../model";

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
            isPublished,
        },
        include: {
            author: true,
            tags: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isPublished: "asc" }, { updatedAt: "desc" }],
    });
};

export const getArticleBySlug = async (
    slug: string,
): Promise<ArticleWithRelations | null> => {
    return prisma.article.findUnique({
        where: {
            slug,
        },
        include: {
            author: true,
            tags: true,
        },
    });
};

export const getAllPublishedArticles = async () => {
    return prisma.article.findMany({
        where: {
            isPublished: true,
        },
        select: {
            slug: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
};
