import { Article } from "@/entities/article";
import { Author } from "@/entities/author";
import { Tag } from "@/entities/tag";

import { ArticleHeader } from "./ArticleHeader";
import { ArticlePreview } from "./ArticlePreview";

interface ArticleCardProps {
    article: Article;
    author: Author;
    tags: Tag[];
}

export const ArticleCard = ({ article, author, tags }: ArticleCardProps) => {
    return (
        <article className="space-y-6 overflow-hidden rounded-3xl bg-white p-6">
            <ArticleHeader article={article} author={author} tags={tags} />
            <ArticlePreview article={article} />
        </article>
    );
};
