"use client";

import { useState } from "react";

import { Article } from "@/entities/article";
import { cn } from "@/shared/lib/cn";

import LikeIcon from "@icons/like.svg";

interface ReadMoreProps {
    article: Article;
    isExpanded: boolean;
    onToggle: () => void;
}

const mockToggleLike = async ({
    articleId,
    isLiked,
}: {
    articleId: string | number;
    isLiked: boolean;
}) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("Моковая отправка лайка в БД:", {
        articleId,
        isLiked,
    });

    return {
        success: true,
    };
};

export const ReadMore = ({ article, isExpanded, onToggle }: ReadMoreProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(article.likesCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLikeClick = async () => {
        if (isLoading) {
            return;
        }

        const nextIsLiked = !isLiked;
        const nextLikesCount = nextIsLiked ? likesCount + 1 : likesCount - 1;

        setIsLiked(nextIsLiked);
        setLikesCount(nextLikesCount);
        setIsLoading(true);

        try {
            await mockToggleLike({
                articleId: article.id,
                isLiked: nextIsLiked,
            });
        } catch (error) {
            setIsLiked(isLiked);
            setLikesCount(likesCount);

            console.error("Ошибка при отправке лайка:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-between">
            <button
                type="button"
                onClick={onToggle}
                className={cn(
                    "inline-block rounded-full bg-gray-900 px-15 py-4 text-xs text-white transition hover:bg-gray-700 sm:px-20 dark:bg-white dark:text-black",
                )}
            >
                {isExpanded ? "Свернуть" : "Читать дальше"}
            </button>

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
