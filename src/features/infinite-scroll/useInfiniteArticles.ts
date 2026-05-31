"use client";

import { ArticleWithRelations } from "@/entities/article/model";
import { ArticleGridFilters } from "@/widgets/article-grid/ui/ArticleGrid";
import { useCallback, useEffect, useRef, useState } from "react";

interface ArticlesApiResponse {
    articles: ArticleWithRelations[];
    hasMore: boolean;
}

export const useInfiniteArticles = (
    initialArticles: ArticleWithRelations[] = [],
    filters?: ArticleGridFilters,
    isPublished = true,
) => {
    const [articles, setArticles] =
        useState<ArticleWithRelations[]>(initialArticles);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    const loadMoreArticles = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const searchParams = new URLSearchParams({
                page: String(page),
                limit: "10",
            });

            if (filters?.authorId) {
                searchParams.set("authorId", String(filters.authorId));
            }

            if (filters?.tagId) {
                searchParams.set("tagId", String(filters.tagId));
            }

            searchParams.set("isPublished", String(isPublished));

            const response = await fetch(
                `/api/articles?${searchParams.toString()}`,
            );

            const data: ArticlesApiResponse = await response.json();

            setArticles((prev) => [...prev, ...data.articles]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } finally {
            setIsLoading(false);
        }
    }, [
        filters?.authorId,
        filters?.tagId,
        hasMore,
        isLoading,
        isPublished,
        page,
    ]);

    useEffect(() => {
        setArticles(initialArticles);
        setPage(2);
        setHasMore(true);
    }, [initialArticles, filters?.authorId, filters?.tagId, isPublished]);

    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                loadMoreArticles();
            }
        });

        observer.observe(loader);

        return () => {
            observer.unobserve(loader);
        };
    }, [loadMoreArticles]);

    return {
        articles,
        loaderRef,
        isLoading,
        hasMore,
    };
};
