import { getArticleBySlug } from "@/entities/article/api";
import { ArticleCard } from "@/widgets/article-grid/ui/ArticleCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const generateMetadata = async ({
    params,
}: ArticlePageProps): Promise<Metadata> => {
    const { slug } = await params;

    const article = await getArticleBySlug(slug, true);

    if (!article) {
        return {};
    }

    return {
        title: article.metaTitle,
        description: article.metaDescription,
    };
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { slug } = await params;

    const article = await getArticleBySlug(slug, true);

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
