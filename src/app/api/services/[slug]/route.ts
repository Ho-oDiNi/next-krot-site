import { NextResponse } from "next/server";

import { getServiceBySlug } from "@/entities/service";

export const revalidate = 0;

export async function GET(
    _request: Request,
    context: { params: Promise<{ slug: string }> },
) {
    const { slug } = await context.params;

    if (!slug) {
        return NextResponse.json(
            { message: "Slug обязателен" },
            { status: 400 },
        );
    }

    const service = await getServiceBySlug(slug);

    if (!service) {
        return NextResponse.json(
            { message: "Услуга не найдена" },
            { status: 404 },
        );
    }

    return NextResponse.json(service);
}
