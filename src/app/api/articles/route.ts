import { getArticles } from "@/entities/article/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const articles = await getArticles({ page, limit });

    return NextResponse.json({
        articles,
        hasMore: articles.length === limit,
    });
};
