import { prisma } from "@/shared/lib/prisma";

import { Author } from "../model";

export const getAuthorBySlug = async (slug: string): Promise<Author | null> => {
    return prisma.author.findUnique({
        where: {
            slug,
        },
    });
};

export const getAuthors = async (): Promise<Author[]> => {
    return prisma.author.findMany({
        orderBy: {
            name: "asc",
        },
    });
};
