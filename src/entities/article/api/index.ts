interface GetArticlesParams {
    page?: number;
    limit?: number;
}

export const getArticles = async ({
    page = 1,
    limit = 10,
}: {
    page?: number;
    limit?: number;
}) => {
    if (!prisma) {
        throw new Error("Prisma client is not initialized");
    }

    return prisma.article.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            author: true,
            tags: true,
        },
    });
};
