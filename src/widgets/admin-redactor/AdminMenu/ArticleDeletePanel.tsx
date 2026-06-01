"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
    deleteArticle,
    type DeleteArticleResult,
} from "@/widgets/admin-article-redactor/api/deleteArticle";
import StatusMessage from "@/shared/ui/StatusMessage";

interface ArticleDeletePanelProps {
    articleSlug: string | null;
    onClose: () => void;
}

const ArticleDeletePanel = ({
    articleSlug,
    onClose,
}: ArticleDeletePanelProps) => {
    const router = useRouter();
    const [status, setStatus] = useState<DeleteArticleResult | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!articleSlug) {
            setStatus({
                success: false,
                message:
                    "Откройте редактирование конкретной статьи для удаления",
            });
            return;
        }

        setStatus(null);

        startTransition(() => {
            void (async () => {
                const result = await deleteArticle(articleSlug);

                setStatus(result);

                if (result.success) {
                    router.replace("/admin");
                    router.refresh();
                    onClose();
                }
            })();
        });
    };

    return (
        <div className="space-y-5 p-8 pt-5 text-black dark:text-white">
            <h2 className="text-2xl font-bold">
                {articleSlug
                    ? `Удалить статью «${articleSlug}»?`
                    : "Статья не выбрана"}
            </h2>

            <StatusMessage
                message={status?.message}
                success={status?.success}
            />

            <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
                Действие нельзя отменить. Статья исчезнет из админки и
                публичного раздела.
            </p>

            <div className="flex-between flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-100"
                >
                    Отмена
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending || !articleSlug}
                    className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Удаление..." : "Удалить статью"}
                </button>
            </div>
        </div>
    );
};

export default ArticleDeletePanel;
