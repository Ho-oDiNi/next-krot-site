import { getArticles } from "@/entities/article/api";
import { ArticleGridClient } from "./ArticleGridClient";

export const ArticleGrid = async () => {
    const articles = await getArticles({
        page: 1,
        limit: 10,
    });

    return <ArticleGridClient initialArticles={articles} />;
};
