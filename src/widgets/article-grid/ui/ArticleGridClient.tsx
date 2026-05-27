"use client";

import { useInfiniteArticles } from "@/features/infinite-scroll/useInfiniteArticles";
import { ArticleCard } from "./ArticleCard";
import { ArticleWithRelations } from "@/entities/article/model";

interface ArticleGridClientProps {
    initialArticles: ArticleWithRelations[];
}

export const ArticleGridClient = ({
    initialArticles,
}: ArticleGridClientProps) => {
    const { articles, loaderRef, isLoading, hasMore } =
        useInfiniteArticles(initialArticles);

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
