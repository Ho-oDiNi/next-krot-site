"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import LikeIcon from "@icons/like.svg";

interface ReadMoreArticle {
    id: number;
    slug: string;
    likesCount: number;
}

interface ReadMoreProps {
    article: ReadMoreArticle;
    showArticleLink?: boolean;
}

const toggleLike = async ({
    articleId,
    isLiked,
}: {
    articleId: number;
    isLiked: boolean;
}) => {
    const response = await fetch(`/api/articles/${articleId}/like`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isLiked }),
    });

    if (!response.ok) {
        throw new Error("Failed to update like");
    }

    return response.json() as Promise<{
        article: {
            id: number;
            likesCount: number;
        };
    }>;
};

export const ReadMore = ({
    article,
    showArticleLink = true,
}: ReadMoreProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(article.likesCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLikeClick = async () => {
        if (isLoading) return;

        const nextIsLiked = !isLiked;

        setIsLiked(nextIsLiked);
        setLikesCount((prev) => prev + (nextIsLiked ? 1 : -1));
        setIsLoading(true);

        try {
            const data = await toggleLike({
                articleId: article.id,
                isLiked: nextIsLiked,
            });

            setLikesCount(data.article.likesCount);
        } catch (error) {
            setIsLiked(isLiked);
            setLikesCount((prev) => prev + (nextIsLiked ? -1 : 1));

            console.error("Ошибка при отправке лайка:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={showArticleLink ? "flex-between" : "flex justify-end"}>
            {showArticleLink && (
                <Link
                    href={`/article/${article.slug}`}
                    className={cn(
                        "inline-block rounded-full bg-gray-900 px-15 py-4 text-xs text-white transition hover:bg-gray-700 sm:px-20 dark:bg-white dark:text-black",
                    )}
                >
                    Читать далее
                </Link>
            )}

            <button
                type="button"
                onClick={handleLikeClick}
                disabled={isLoading}
                aria-pressed={isLiked}
                aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
                className="flex-center gap-3 disabled:opacity-60"
            >
                <LikeIcon
                    className={cn(
                        "size-6 transition",
                        isLiked
                            ? "[&_path]:fill-red-500 [&_path]:stroke-red-500"
                            : "[&_path]:fill-transparent [&_path]:stroke-gray-500",
                    )}
                />

                <span className="mb-1 text-sm text-gray-500">{likesCount}</span>
            </button>
        </div>
    );
};
