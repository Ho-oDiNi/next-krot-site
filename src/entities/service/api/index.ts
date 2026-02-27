import { Prisma } from "@prisma/client";
import { cache } from "react";

import prisma from "@/shared/lib/prisma";
import { Service, ServiceWithCategory } from "../model";
import { categoryWithServicesInclude, mapCategory } from "@/entities/category";

const serviceWithCategoryInclude = {
    category: {
        include: categoryWithServicesInclude,
    },
} satisfies Prisma.ServiceInclude;


type ServiceModel = Prisma.ServiceGetPayload<{
    include: {
        category: {
            select: {
                slug: true;
            };
        };
    };
}>;

const mapService = (service: ServiceModel): Service => {
    return {
        slug: service.slug,
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        title: service.title,
        description: service.description,
        mainText: service.mainText,
        guarantee: service.guarantee,
        duration: service.duration,
    } satisfies Service;
};

export const getServiceBySlug = cache(
    async (slug: string | undefined): Promise<Service | undefined> => {
        if (!slug) {
            return undefined;
        }

        const service = await prisma.service.findUnique({
            where: { slug },
            include: {
                category: {
                    select: {
                        slug: true,
                    },
                },
            },
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
            include: {
                category: {
                    select: {
                        slug: true,
                    },
                },
            },
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
