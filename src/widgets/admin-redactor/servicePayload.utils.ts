import { Service } from "@/entities/service";

export type ServiceActionInput = Service & {
    categoryId?: number | null;
    categorySlug?: string | null;
};

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

const optionalString = (value: unknown): string | null => {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const sanitizeList = (items: unknown[]): string[] =>
    items
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item): item is string => item.length > 0);

const sanitizeFaqItems = (
    items: unknown[],
): {
    question: string;
    answer: string;
}[] => {
    return items
        .map((item) => {
            if (!Array.isArray(item)) {
                return { question: "", answer: "" };
            }

            const [question, answer] = item;

            return {
                question: typeof question === "string" ? question.trim() : "",
                answer: typeof answer === "string" ? answer.trim() : "",
            };
        })
        .filter(
            ({ question, answer }) => question.length > 0 || answer.length > 0,
        );
};

const resolveImageUrl = (value: unknown, kind: "before" | "after"): string => {
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            throw new Error(
                `Ссылка на ${kind === "before" ? "первое" : "второе"} изображение не может быть пустой`,
            );
        }
        return trimmed;
    }

    if (value && typeof value === "object" && "src" in value) {
        const src = (value as { src?: unknown }).src;
        if (typeof src === "string" && src.trim().length > 0) {
            return src.trim();
        }
    }

    throw new Error(
        `Неверный формат ссылки на ${
            kind === "before" ? "первое" : "второе"
        } изображение`,
    );
};

export interface NormalizedServicePayload {
    data: {
        slug: string;
        metaTitle: string;
        metaDescription: string;
        title: string;
        description: string;
        mainText: string;
    };
    children: {
        whatIncluded: { text: string; position: number }[];
        materials: { text: string; position: number }[];
        faqs: { question: string; answer: string; position: number }[];
    };
    comparison: {
        beforeImageUrl: string;
        beforeImageAlt: string | null;
        afterImageUrl: string;
        afterImageAlt: string | null;
    } | null;
}

export const normalizeServicePayload = (
    payload: ServiceActionInput,
): NormalizedServicePayload => {
    const whatIncluded = sanitizeList(payload.whatIncluded ?? []);
    const materials = sanitizeList(payload.materials ?? []);
    const faqItems = sanitizeFaqItems(payload.faqItems ?? []);

    const price = Number(payload.price);

    if (!Number.isFinite(price) || price < 0) {
        throw new Error("Цена должна быть неотрицательным числом");
    }

    const data = {
        slug: requiredString(payload.slug, "Slug обязателен"),
        metaTitle: requiredString(payload.metaTitle, "Meta title обязателен"),
        metaDescription: requiredString(
            payload.metaDescription,
            "Meta description обязательна",
        ),
        title: requiredString(payload.title, "Title обязателен"),
        description: requiredString(
            payload.description,
            "Описание обязательно",
        ),
        mainText: typeof payload.mainText === "string" ? payload.mainText : "",
    } as const;

    const children = {
        whatIncluded: whatIncluded.map((text, position) => ({
            text,
            position,
        })),
        materials: materials.map((text, position) => ({ text, position })),
        faqs: faqItems.map(({ question, answer }, position) => ({
            question,
            answer,
            position,
        })),
    } as const;

    const comparisonSource = payload.comparedImages ?? null;
    const comparison = comparisonSource
        ? {
              beforeImageUrl: resolveImageUrl(
                  comparisonSource.beforeImage,
                  "before",
              ),
              beforeImageAlt: optionalString(comparisonSource.beforeImageAlt),
              afterImageUrl: resolveImageUrl(
                  comparisonSource.afterImage,
                  "after",
              ),
              afterImageAlt: optionalString(comparisonSource.afterImageAlt),
          }
        : null;

    return {
        data,
        children,
        comparison,
    };
};
