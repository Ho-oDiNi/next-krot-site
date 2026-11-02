"use client";

import type { ArticleWithRelations } from "@/entities/article/model";
import type { ArticleGridFilters } from "@/widgets/article-grid/ui/ArticleGrid";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;
const EMPTY_ARTICLES: ArticleWithRelations[] = [];
const LOAD_ERROR = "Не удалось загрузить статьи. Попробуйте ещё раз.";

export const useInfiniteArticles = (
    initialArticles: ArticleWithRelations[] = EMPTY_ARTICLES,
    filters?: ArticleGridFilters,
    isPublished = true,
) => {
    const [articles, setArticles] = useState(initialArticles);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(initialArticles.length >= PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const requestRef = useRef<AbortController | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const loadMoreArticles = useCallback(async () => {
        // Lock synchronously: multiple observer callbacks may run before React renders.
        if (requestRef.current || !hasMore) return;
        const controller = new AbortController();
        requestRef.current = controller;
        setIsLoading(true);
        setError(null);

        try {
            const searchParams = new URLSearchParams({
                page: String(page),
                limit: String(PAGE_SIZE),
                isPublished: String(isPublished),
            });
            if (filters?.authorId) {
                searchParams.set("authorId", String(filters.authorId));
            }
            if (filters?.tagId) {
                searchParams.set("tagId", String(filters.tagId));
            }

            const response = await fetch(`/api/articles?${searchParams}`, {
                signal: controller.signal,
            });
            if (!response.ok) throw new Error(LOAD_ERROR);

            const data = await response.json();
            if (
                !Array.isArray(data?.articles) ||
                typeof data.hasMore !== "boolean"
            ) {
                throw new Error(LOAD_ERROR);
            }
            // Filters/navigation may have changed while the request was in flight.
            if (requestRef.current !== controller) return;

            setArticles((prev) => {
                const ids = new Set(prev.map((article) => article.id));
                return [
                    ...prev,
                    ...data.articles.filter((article: ArticleWithRelations) => {
                        if (ids.has(article.id)) return false;
                        ids.add(article.id);
                        return true;
                    }),
                ];
            });
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } catch {
            if (
                requestRef.current === controller &&
                !controller.signal.aborted
            ) {
                setError(LOAD_ERROR);
            }
        } finally {
            if (requestRef.current === controller) {
                requestRef.current = null;
                setIsLoading(false);
            }
        }
    }, [filters?.authorId, filters?.tagId, hasMore, isPublished, page]);

    useEffect(() => {
        setArticles(initialArticles);
        setPage(2);
        setHasMore(initialArticles.length >= PAGE_SIZE);
        setError(null);
        setIsLoading(false);
        return () => {
            requestRef.current?.abort();
            requestRef.current = null;
        };
    }, [initialArticles, filters?.authorId, filters?.tagId, isPublished]);

    useEffect(() => {
        const loader = loaderRef.current;
        // Wait for an explicit retry after failure instead of continuously retrying.
        if (!loader || error || isLoading || !hasMore) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) void loadMoreArticles();
        });
        observer.observe(loader);
        return () => observer.disconnect();
    }, [loadMoreArticles, error, isLoading, hasMore]);

    return {
        articles,
        loaderRef,
        isLoading,
        hasMore,
        error,
        retry: loadMoreArticles,
    };
};
