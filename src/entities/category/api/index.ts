import { Prisma } from "@prisma/client";
import { cache } from "react";

import prisma from "@/shared/lib/prisma";
import { Category } from "../model";

export const categoryWithServicesInclude = {
    services: {
        select: {
            slug: true,
        },
        orderBy: {
            id: "asc" as const,
        },
    },
} satisfies Prisma.CategoryInclude;

type CategoryWithServicesModel = Prisma.CategoryGetPayload<{
    include: typeof categoryWithServicesInclude;
}>;

export const mapCategory = (category: CategoryWithServicesModel): Category => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    serviceSlugs: category.services.map((service) => service.slug),
    imageUrl: category.imageUrl ?? undefined,
    position: category.position ?? undefined,
});

export const getCategoryByServiceSlug = cache(
    async (serviceSlug: string): Promise<Category | undefined> => {
        if (!serviceSlug) {
            return undefined;
        }

        const service = await prisma.service.findUnique({
            where: { slug: serviceSlug },
            include: {
                category: {
                    include: categoryWithServicesInclude,
                },
            },
        });

        if (!service?.category) {
            return undefined;
        }

        return mapCategory(service.category);
    },
);

export const getCategories = cache(async (): Promise<Category[]> => {
    const categories = await prisma.category.findMany({
        orderBy: {
            id: "asc",
        },
        include: categoryWithServicesInclude,
    });

    return categories.map(mapCategory);
});
