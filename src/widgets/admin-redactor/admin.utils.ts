import { Category } from "@/entities/category";
import { Service } from "@/entities/service";

export const createEmptyService = (): Service => ({
    slug: "",
    metaTitle: "",
    metaDescription: "",
    title: "",
    description: "",
    mainText: "",
    guarantee: "",
    duration: "",
});

export const fetchServiceBySlug = async (
    serviceSlug: string,
): Promise<Service | null> => {
    if (!serviceSlug) {
        return null;
    }

    try {
        const response = await fetch(`/api/services/${serviceSlug}`);
        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as Service;
        return data;
    } catch (error) {
        console.error("Не удалось загрузить данные услуги", error);
        return null;
    }
};

export const fetchServiceCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch("/api/service-categories");

        if (!response.ok) {
            throw new Error("Не удалось загрузить категории");
        }

        const data = (await response.json()) as Category[];
        return data;
    } catch (error) {
        console.error("Не удалось загрузить список категорий", error);
        throw error instanceof Error
            ? error
            : new Error("Не удалось загрузить категории");
    }
};

export const getServiceTitle = (
    formData: Service,
    serviceSlug: string | undefined,
): string => {
    return formData.title?.trim() || serviceSlug?.trim() || "эту услугу";
};
