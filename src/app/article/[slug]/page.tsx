import { getArticleBySlug } from "@/entities/article/api";
import { ArticleCard } from "@/widgets/article-grid/ui/ArticleCard";
import { notFound } from "next/navigation";

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { slug } = await params;

    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }
    return (
        <ArticleCard
            article={article}
            author={article.author}
            tags={article.tags}
            isFullArticle
        />
    );
};
export default ArticlePage;
