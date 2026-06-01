import Image from "next/image";
import Link from "next/link";

import type { ArticleWithRelations } from "@/entities/article/model";
import { cn } from "@/shared/lib/cn";

const ARTICLE_EDIT_BASE_PATH = "/admin/redactor/article";
const ADMIN_ARTICLE_DATE_LOCALE = "en-GB";

const formatAdminArticleDate = (date: Date) => {
    const today = new Date();
    const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const dateStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

    const daysDiff = Math.round(
        (dateStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === 0) {
        return "Today";
    }

    if (daysDiff === -1) {
        return "Yesterday";
    }

    return new Intl.DateTimeFormat(ADMIN_ARTICLE_DATE_LOCALE, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const ImagePlaceholderIcon = () => (
    <svg
        aria-hidden="true"
        className="size-5 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.75 6.75A2 2 0 0 1 6.75 4.75h10.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2V6.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
        />
        <path
            d="m6.75 16.75 3.5-3.5 2.5 2.5 1.75-1.75 2.75 2.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="15.75" cy="8.25" r="1" fill="currentColor" />
    </svg>
);

const PencilIcon = () => (
    <svg
        aria-hidden="true"
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.75 19.25h3.1L18.6 8.5a2.12 2.12 0 0 0-3-3L4.75 16.25v3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="m14.25 6.85 2.9 2.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
        />
    </svg>
);

interface AdminArticleGridItemProps {
    article: ArticleWithRelations;
}

export const AdminArticleGridItem = ({
    article,
}: AdminArticleGridItemProps) => {
    const editHref = `${ARTICLE_EDIT_BASE_PATH}/${article.slug}`;
    const statusText = article.isPublished ? "Published" : "Draft";

    return (
        <article className="flex items-center gap-4 border-b border-slate-200 py-5 last:border-b-0 sm:gap-6 dark:border-slate-800">
            <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 sm:h-20 sm:w-32 dark:bg-slate-800">
                {article.previewImg ? (
                    <Image
                        src={article.previewImg}
                        alt={article.title}
                        width={128}
                        height={80}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <ImagePlaceholderIcon />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 text-base leading-tight font-bold text-slate-950 sm:text-xl dark:text-white">
                    {article.title}
                </h2>

                <p className="mt-1 text-sm leading-tight text-slate-400 sm:text-lg">
                    By {article.author.name} -{" "}
                    {formatAdminArticleDate(article.updatedAt)}
                </p>

                <p
                    className={cn(
                        "mt-1 text-sm leading-tight sm:text-lg",
                        article.isPublished
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-pink-600 dark:text-pink-400",
                    )}
                >
                    {statusText}
                </p>
            </div>

            <Link
                href={editHref}
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 sm:size-11 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                aria-label={`Редактировать статью «${article.title}»`}
            >
                <PencilIcon />
            </Link>
        </article>
    );
};
