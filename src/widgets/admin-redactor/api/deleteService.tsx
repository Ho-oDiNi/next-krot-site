"use server";

import { logger } from "@/shared/lib/logger";
import prisma from "@/shared/lib/prisma";
import { getServiceBySlug } from "@/entities/service";
import { revalidateServicePaths } from "../serviceRevalidate.utils";
import { isAdminServerSide } from "@/core/auth";

interface DeleteServiceState {
    success: boolean;
    message: string;
}

export async function deleteService(
    prevState: DeleteServiceState | null,
    formData: FormData,
): Promise<DeleteServiceState> {
    const serviceSlug = formData.get("serviceSlug");
    try {
        const isAdmin = await isAdminServerSide();

        if (!isAdmin) {
            throw new Error("Ошибка авторизации");
        }

        if (!serviceSlug || typeof serviceSlug !== "string") {
            throw new Error("Slug обязателен");
        }

        const service = await getServiceBySlug(serviceSlug);

        if (!service) {
            throw new Error("Услуга не найдена");
        }

        await prisma.service.delete({
            where: { slug: serviceSlug },
        });

        await revalidateServicePaths([
            {
                categorySlug: service.categorySlug,
                slug: service.slug,
            },
        ]);

        return {
            success: true,
            message: "Услуга успешно удалена",
        };
    } catch (error) {
        logger.error("Ошибка при удалении услуги", {
            error,
            serviceSlug,
        });
        return {
            success: false,
            message: error instanceof Error ? error.message : "Ошибка сервера",
        };
    }
}
