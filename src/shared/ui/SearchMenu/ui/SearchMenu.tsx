"use client";
import defaultImg from "@images/mockImg.png";

import { useEffect, useState } from "react";
import Link from "next/link";

import CloseIcon from "@icons/close-black.svg";
import Image from "next/image";

interface SearchMenuProps {
    onClose: () => void;
}

interface ArticleSearchResult {
    id: number;
    slug: string;
    title: string;
    previewImg: string | null;
    readingTime: number | null;
    createdAt: string;
}

const MIN_SEARCH_LENGTH = 5;
const SEARCH_DEBOUNCE_MS = 350;

export const SearchMenu = ({ onClose }: SearchMenuProps) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [articles, setArticles] = useState<ArticleSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.length < MIN_SEARCH_LENGTH) {
            setArticles([]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        const searchArticles = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/articles/search?q=${encodeURIComponent(debouncedQuery)}`,
                    {
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error("Ошибка поиска статей");
                }

                const data: ArticleSearchResult[] = await response.json();

                setArticles(data);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error(error);
                setArticles([]);
            } finally {
                setIsLoading(false);
            }
        };

        searchArticles();

        return () => {
            controller.abort();
        };
    }, [debouncedQuery]);

    const shouldShowHint =
        query.trim().length > 0 && query.trim().length < MIN_SEARCH_LENGTH;

    const shouldShowSearchResult =
        shouldShowHint ||
        isLoading ||
        debouncedQuery.length >= MIN_SEARCH_LENGTH;

    return (
        <div className="w-full gap-6 bg-gray-200 p-4 dark:bg-gray-900">
            <div className="mx-auto flex w-full items-center gap-4 lg:max-w-3xl">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Искать..."
                        className="max-h-16 w-full rounded-full border-2 border-gray-300 bg-white px-6 py-8 text-black transition outline-none focus:border-gray-500 dark:bg-gray-800 dark:text-white"
                        name="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        autoComplete="off"
                    />

                    {shouldShowSearchResult && (
                        <div className="absolute top-[calc(100%+20px)] right-0 left-0 z-50 flex flex-col gap-3">
                            {shouldShowHint && (
                                <div className="rounded-[28px] bg-white px-6 py-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                    Введите минимум 5 символов
                                </div>
                            )}

                            {isLoading && (
                                <div className="rounded-[28px] bg-white px-6 py-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                    Ищем статьи...
                                </div>
                            )}

                            {!isLoading &&
                                debouncedQuery.length >= MIN_SEARCH_LENGTH &&
                                articles.length === 0 && (
                                    <div className="rounded-[28px] bg-white px-6 py-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                        Ничего не найдено
                                    </div>
                                )}

                            {!isLoading &&
                                articles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/articles/${article.slug}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 rounded-4xl bg-white p-6 text-black transition hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    >
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-300">
                                            <Image
                                                src={
                                                    article.previewImg ??
                                                    defaultImg
                                                }
                                                alt={article.title}
                                                className="h-full w-full rounded-xl object-cover"
                                                width={96}
                                                height={96}
                                            />
                                        </div>

                                        <p className="line-clamp-3 text-xl leading-[1.15] font-bold text-gray-950 dark:text-white">
                                            {article.title}
                                        </p>
                                    </Link>
                                ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="h-5 w-5 shrink-0 rounded-full hover:opacity-70"
                    aria-label="Закрыть меню поиска"
                >
                    <CloseIcon className="w-full text-black dark:text-white" />
                </button>
            </div>
        </div>
    );
};
