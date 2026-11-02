jest.mock("@/shared/lib/prisma", () => ({
    prisma: {
        article: {
            findMany: jest.fn().mockResolvedValue([]),
            findFirst: jest.fn().mockResolvedValue(null),
        },
        $executeRaw: jest.fn(),
    },
}));
import { prisma } from "@/shared/lib/prisma";
import {
    getArticles,
    getArticleBySlug,
    getAllPublishedArticles,
    getRelatedArticles,
} from "./index";

test("reading articles never rewrites historical publication timestamps", async () => {
    await getArticles({ page: 2, limit: 10, isPublished: true });
    await getArticleBySlug("scheduled", true);
    await getAllPublishedArticles();
    await getRelatedArticles(1, [2]);
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(prisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
            skip: 10,
            take: 10,
            where: expect.objectContaining({
                isPublished: true,
                OR: [
                    { publishedAt: null },
                    { publishedAt: { lte: expect.any(Date) } },
                ],
            }),
            orderBy: [
                { isPublished: "asc" },
                { publishedAt: "desc" },
                { createdAt: "desc" },
                { id: "desc" },
            ],
        }),
    );
});
