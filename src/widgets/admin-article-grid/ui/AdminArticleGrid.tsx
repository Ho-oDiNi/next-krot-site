import { getArticles } from "@/entities/article/api";

import { AdminArticleGridItem } from "./AdminArticleGridItem";

const ADMIN_ARTICLES_LIMIT = 1000;

export const AdminArticleGrid = async () => {
    const articles = await getArticles({
        page: 1,
        limit: ADMIN_ARTICLES_LIMIT,
    });

    if (articles.length === 0) {
        return (
            <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Статьи пока не добавлены.
            </p>
        );
    }

    return (
        <div className="w-full space-y-2">
            {articles.map((article) => (
                <AdminArticleGridItem key={article.id} article={article} />
            ))}
        </div>
    );
};
