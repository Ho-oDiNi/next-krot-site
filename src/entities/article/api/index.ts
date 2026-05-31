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
    isPublished = true,
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
            isPublished: isPublished,
        },
        include: {
            author: true,
            tags: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            updatedAt: "desc",
        },
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
