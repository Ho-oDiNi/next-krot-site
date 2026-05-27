"use client";

import { ArticleWithRelations } from "@/entities/article/model";
import { useCallback, useEffect, useRef, useState } from "react";

interface ArticlesApiResponse {
    articles: ArticleWithRelations[];
    hasMore: boolean;
}

export const useInfiniteArticles = (
    initialArticles: ArticleWithRelations[] = [],
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
            const response = await fetch(`/api/articles?page=${page}&limit=10`);
            const data: ArticlesApiResponse = await response.json();

            setArticles((prev) => [...prev, ...data.articles]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } finally {
            setIsLoading(false);
        }
    }, [hasMore, isLoading, page]);

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
