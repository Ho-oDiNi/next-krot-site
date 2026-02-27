import { Service } from "@/entities/service";

const requiredString = (value: unknown, message: string): string => {
    if (typeof value !== "string") {
        throw new Error(message);
    }

    const trimmed = value.trim();

    if (!trimmed) {
        throw new Error(message);
    }

    return trimmed;
};

export interface NormalizedServicePayload {
    data: Service;
}

export const normalizeServicePayload = (
    payload: Service,
): NormalizedServicePayload => {
    const data: Service = {
        slug: requiredString(payload.slug, "Slug обязателен"),
        metaTitle: requiredString(payload.metaTitle, "Meta title обязателен"),
        metaDescription: requiredString(
            payload.metaDescription,
            "Meta description обязательна",
        ),
        title: requiredString(payload.title, "Title обязателен"),
        description: requiredString(payload.description, "Описание обязательно"),
        mainText:
            typeof payload.mainText === "string" ? payload.mainText.trim() : "",
        guarantee: requiredString(payload.guarantee, "Гарантия обязательна"),
        duration: requiredString(payload.duration, "Срок выполнения обязателен"),
    };

    return {
        data,
    };
};
