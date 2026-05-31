import { getArticles } from "@/entities/article/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const authorId = searchParams.get("authorId");
    const tagId = searchParams.get("tagId");
    const isPublishedParam = searchParams.get("isPublished");
    const isPublished = isPublishedParam !== "false";

    const articles = await getArticles({
        page,
        limit,
        filters: {
            authorId: authorId ? Number(authorId) : undefined,
            tagId: tagId ? Number(tagId) : undefined,
        },
        isPublished,
    });

    return NextResponse.json({
        articles,
        hasMore: articles.length === limit,
    });
};
