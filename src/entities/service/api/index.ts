import { Prisma } from "@prisma/client";
import { cache } from "react";

import prisma from "@/shared/lib/prisma";
import { Service, ServiceWithCategory } from "../model";
import { ComparisonImageSet } from "@/features/comparison-card";
import { categoryWithServicesInclude, mapCategory } from "@/entities/category";

const serviceDetailsInclude = {
    whatIncluded: {
        orderBy: {
            position: "asc" as const,
        },
    },
    materials: {
        orderBy: {
            position: "asc" as const,
        },
    },
    faqs: {
        orderBy: {
            position: "asc" as const,
        },
    },
    comparison: true,
} satisfies Prisma.ServiceInclude;

const serviceWithCategoryInclude = {
    ...serviceDetailsInclude,
    category: {
        include: categoryWithServicesInclude,
    },
} satisfies Prisma.ServiceInclude;

type ServiceWithCategoryModel = Prisma.ServiceGetPayload<{
    include: typeof serviceWithCategoryInclude;
}>;

type ServiceModel = Prisma.ServiceGetPayload<{
    include: typeof serviceDetailsInclude;
}>;

const mapComparison = (
    comparison: ServiceModel["comparison"],
): ComparisonImageSet | undefined => {
    if (!comparison) {
        return undefined;
    }

    return {
        beforeImage: comparison.beforeImageUrl,
        beforeImageAlt: comparison.beforeImageAlt ?? undefined,
        afterImage: comparison.afterImageUrl,
        afterImageAlt: comparison.afterImageAlt ?? undefined,
    } satisfies ComparisonImageSet;
};

const mapService = (service: ServiceModel): Service => {
    const withCategory = service as Partial<ServiceWithCategoryModel>;

    return {
        id: service.id,
        slug: service.slug,
        shortName: service.shortName ?? undefined,
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        title: service.title,
        description: service.description,
        contentTitle: service.contentTitle ?? undefined,
        contentDescription: service.contentDescription ?? undefined,
        mainText: service.mainText,
        guarantee: service.guarantee,
        duration: service.duration,
        price: service.price,
        priceAbbr: service.priceAbbr,
        priceExplanation: service.priceExplanation ?? undefined,
        faqDescription: service.faqDescription ?? "",
        faqItems: service.faqs.map(({ question, answer }) => [
            question,
            answer,
        ]),
        whatIncluded: service.whatIncluded.map((item) => item.text),
        materials: service.materials.map((item) => item.text),
        comparedImages: mapComparison(service.comparison),
        categoryId: service.categoryId,
        categorySlug: withCategory.category?.slug,
    } satisfies Service;
};

export const getServiceBySlug = cache(
    async (slug: string | undefined): Promise<Service | undefined> => {
        if (!slug) {
            return undefined;
        }

        const service = await prisma.service.findUnique({
            where: { slug },
            include: serviceWithCategoryInclude,
        });

        if (!service) {
            return undefined;
        }

        return mapService(service);
    },
);

export const getServicesByCategory = cache(
    async (categoryId: number): Promise<Service[]> => {
        if (!categoryId) {
            return [];
        }

        const services = await prisma.service.findMany({
            where: { categoryId },
            orderBy: {
                id: "asc",
            },
            include: serviceDetailsInclude,
        });

        return services.map(mapService);
    },
);

export const getServicesWithCategories = cache(
    async (limit?: number): Promise<ServiceWithCategory[]> => {
        const services = await prisma.service.findMany({
            orderBy: {
                id: "asc",
            },
            take: limit,
            include: serviceWithCategoryInclude,
        });

        return services.map((service) => ({
            service: mapService(service),
            category: mapCategory(service.category),
        }));
    },
);
