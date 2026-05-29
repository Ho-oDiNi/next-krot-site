import { NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export const PATCH = async (request: Request, { params }: RouteParams) => {
    if (!prisma) {
        return NextResponse.json(
            { message: "Prisma client is not initialized" },
            { status: 500 },
        );
    }

    const { id } = await params;
    const articleId = Number(id);

    if (Number.isNaN(articleId)) {
        return NextResponse.json(
            { message: "Invalid article id" },
            { status: 400 },
        );
    }

    const { isLiked } = (await request.json()) as {
        isLiked: boolean;
    };

    const article = await prisma.article.update({
        where: {
            id: articleId,
        },
        data: {
            likesCount: {
                increment: isLiked ? 1 : -1,
            },
        },
        select: {
            id: true,
            likesCount: true,
        },
    });

    return NextResponse.json({ article });
};
