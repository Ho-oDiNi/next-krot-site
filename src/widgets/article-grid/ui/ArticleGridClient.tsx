"use client";

import { ArticleWithRelations } from "@/entities/article/model";
import { useInfiniteArticles } from "@/features/infinite-scroll/useInfiniteArticles";
import { ArticleCard } from "./ArticleCard";
import { ArticleGridFilters } from "./ArticleGrid";

interface ArticleGridClientProps {
    initialArticles: ArticleWithRelations[];
    filters?: ArticleGridFilters;
}

export const ArticleGridClient = ({
    initialArticles,
    filters,
}: ArticleGridClientProps) => {
    const { articles, loaderRef, isLoading, hasMore } = useInfiniteArticles(
        initialArticles,
        filters,
    );

    return (
        <div className="w-full space-y-6">
            {articles.map((article) => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    author={article.author}
                    tags={article.tags}
                />
            ))}

            {hasMore && <div ref={loaderRef} className="h-10" />}

            {isLoading && (
                <p className="text-center text-sm text-gray-500">Загрузка...</p>
            )}
        </div>
    );
};
