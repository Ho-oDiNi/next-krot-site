import { getArticles } from "@/entities/article/api";
import { ArticleGridClient } from "@/widgets/article-grid/ui/ArticleGridClient";

const ADMIN_ARTICLES_LIMIT = 1000;

export const AdminArticleGrid = async () => {
    const articles = await getArticles({
        page: 1,
        limit: ADMIN_ARTICLES_LIMIT,
    });

    return (
        <ArticleGridClient
            initialArticles={articles}
            editBasePath="/admin/redactor/article"
            isInfiniteScrollEnabled={false}
        />
    );
};
