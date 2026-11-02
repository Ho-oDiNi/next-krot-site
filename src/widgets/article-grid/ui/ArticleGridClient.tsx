"use client";

import { ArticleWithRelations } from "@/entities/article/model";
import { useInfiniteArticles } from "@/features/infinite-scroll/useInfiniteArticles";
import { ArticleCard } from "./ArticleCard";
import { ArticleGridFilters } from "./ArticleGrid";

interface ArticleGridClientProps {
    initialArticles: ArticleWithRelations[];
    filters?: ArticleGridFilters;
    isPublished?: boolean;
    editBasePath?: string;
    isInfiniteScrollEnabled?: boolean;
}

export const ArticleGridClient = ({
    initialArticles,
    filters,
    isPublished = true,
    editBasePath,
    isInfiniteScrollEnabled = true,
}: ArticleGridClientProps) => {
    const { articles, loaderRef, isLoading, hasMore, error, retry } =
        useInfiniteArticles(initialArticles, filters, isPublished);

    return (
        <div className="w-full space-y-6">
            {articles.map((article) => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    author={article.author}
                    tags={article.tags}
                    editHref={
                        editBasePath
                            ? `${editBasePath}/${article.slug}`
                            : undefined
                    }
                />
            ))}

            {isInfiniteScrollEnabled && hasMore && (
                <div ref={loaderRef} className="h-10" />
            )}

            {error && (
                <div role="alert" className="space-y-2 text-center text-sm">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => void retry()}
                        disabled={isLoading}
                    >
                        Повторить загрузку
                    </button>
                </div>
            )}

            {isLoading && (
                <p className="text-center text-sm text-gray-500">Загрузка...</p>
            )}
        </div>
    );
};
