import { prisma } from "@/shared/lib/prisma";

import { Tag } from "../model";

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
    if (!prisma) {
        throw new Error("Prisma client is not initialized");
    }

    return prisma.tag.findUnique({
        where: {
            slug,
        },
    });
};

export const getTags = async (): Promise<Tag[]> => {
    if (!prisma) {
        throw new Error("Prisma client is not initialized");
    }

    return prisma.tag.findMany({
        orderBy: {
            name: "asc",
        },
    });
};
