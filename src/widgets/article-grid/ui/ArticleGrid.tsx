import { getArticles } from "@/entities/article/api";
import { ArticleGridClient } from "./ArticleGridClient";

export interface ArticleGridFilters {
    authorId?: number;
    tagId?: number;
}

interface ArticleGridProps {
    filters?: ArticleGridFilters;
}

export const ArticleGrid = async ({ filters }: ArticleGridProps) => {
    const articles = await getArticles({
        page: 1,
        limit: 10,
        filters,
        isPublished: true,
    });

    return <ArticleGridClient initialArticles={articles} filters={filters} />;
};
