import { Prisma } from "@prisma/client";
import { cache } from "react";

import prisma from "@/shared/lib/prisma";
import { CategoryWithServices, ServicePreview } from "../model";

const categoryWithServicePreviewsInclude = {
    services: {
        select: {
            id: true,
            slug: true,
            title: true,
        },
        orderBy: {
            id: "asc" as const,
        },
    },
} satisfies Prisma.CategoryInclude;

type CategoryWithServicePreviewsModel = Prisma.CategoryGetPayload<{
    include: typeof categoryWithServicePreviewsInclude;
}>;

const mapServicePreview = (
    service: CategoryWithServicePreviewsModel["services"][number],
): ServicePreview => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
});

const mapCategoryWithServices = (
    category: CategoryWithServicePreviewsModel,
): CategoryWithServices => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    imageUrl: category.imageUrl ?? undefined,
    position: category.position ?? undefined,
    services: category.services.map(mapServicePreview),
});

export const getCategoriesWithServices = cache(
    async (): Promise<CategoryWithServices[]> => {
        const categories = await prisma.category.findMany({
            orderBy: {
                id: "asc",
            },
            include: categoryWithServicePreviewsInclude,
        });

        return categories.map(mapCategoryWithServices);
    },
);
