"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import LikeIcon from "@icons/like.svg";

interface LikeButtonArticle {
    id: number;
    likesCount: number;
}

interface LikeButtonProps {
    article: LikeButtonArticle;
    className?: string;
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

export const LikeButton = ({ article, className }: LikeButtonProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(article.likesCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLikeClick = async () => {
        if (isLoading) {
            return;
        }

        const previousIsLiked = isLiked;
        const nextIsLiked = !previousIsLiked;

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
            setIsLiked(previousIsLiked);
            setLikesCount((prev) => prev + (nextIsLiked ? -1 : 1));

            console.error("Ошибка при отправке лайка:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLikeClick}
            disabled={isLoading}
            aria-pressed={isLiked}
            aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
            className={cn("flex-center gap-3 disabled:opacity-60", className)}
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
    );
};
