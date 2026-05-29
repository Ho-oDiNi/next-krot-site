import { prisma } from "@/shared/lib/prisma";

interface GetArticlesParams {
    page: number;
    limit: number;
    filters?: {
        authorId?: number;
        tagId?: number;
    };
}

export const getArticles = async ({
    page,
    limit,
    filters,
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
