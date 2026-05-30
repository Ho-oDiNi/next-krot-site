import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";

const MIN_SEARCH_LENGTH = 5;
const SEARCH_LIMIT = 8;

export const GET = async (request: NextRequest) => {
    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query || query.length < MIN_SEARCH_LENGTH) {
        return NextResponse.json([]);
    }

    const articles = await prisma.article.findMany({
        where: {
            title: {
                startsWith: query,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            slug: true,
            title: true,
            previewImg: true,
            readingTime: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: SEARCH_LIMIT,
    });

    return NextResponse.json(articles);
};
