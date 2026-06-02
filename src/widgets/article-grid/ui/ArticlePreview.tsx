import { Article } from "@/entities/article";
import Link from "next/link";

import { ArticleBody } from "./ArticleBody";
import { ReadMore } from "./ReadMore";

interface ArticlePreviewProps {
    article: Article;
    editHref?: string;
    isFullArticle?: boolean;
}

export const ArticlePreview = ({
    article,
    editHref,
    isFullArticle = false,
}: ArticlePreviewProps) => {
    return (
        <>
            <ArticleBody article={article} isExpanded={isFullArticle} />

            {editHref ? (
                <Link
                    href={editHref}
                    className="inline-block rounded-full bg-gray-900 px-15 py-4 text-xs text-white transition hover:bg-gray-700 sm:px-20 dark:bg-white dark:text-black"
                >
                    Редактировать
                </Link>
            ) : (
                <ReadMore
                    article={{
                        id: article.id,
                        slug: article.slug,
                        likesCount: article.likesCount,
                    }}
                    showArticleLink={!isFullArticle}
                />
            )}
        </>
    );
};
