import { Article } from "@/entities/article";
import { Author } from "@/entities/author";
import { Tag } from "@/entities/tag";

import { ArticleHeader } from "./ArticleHeader";
import { ArticlePreview } from "./ArticlePreview";

interface ArticleCardProps {
    article: Article;
    author: Author;
    tags: Tag[];
    editHref?: string;
}

export const ArticleCard = ({
    article,
    author,
    tags,
    editHref,
}: ArticleCardProps) => {
    return (
        <article className="space-y-6 overflow-hidden rounded-3xl bg-white p-6 dark:bg-gray-900">
            <ArticleHeader article={article} author={author} tags={tags} />
            <ArticlePreview article={article} editHref={editHref} />
        </article>
    );
};
