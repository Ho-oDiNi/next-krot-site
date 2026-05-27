"use client";

import { Article } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export const useInfiniteArticles = (initialArticles: Article[] = []) => {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    const loadMoreArticles = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/articles?page=${page}&limit=10`);
            const data = await response.json();

            setArticles((prev) => [...prev, ...data.articles]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } finally {
            setIsLoading(false);
        }
    };

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
    }, [page, hasMore, isLoading]);

    return {
        articles,
        loaderRef,
        isLoading,
        hasMore,
    };
};
