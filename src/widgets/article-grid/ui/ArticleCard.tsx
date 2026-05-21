import { Article } from "@/entities/article";
import { ReadMore } from "./ReadMore";
import { ArticleBody } from "./ArticleBody";
import { Author } from "@/entities/author";
import { ArticleHeader } from "./ArticleHeader";
import { Tag } from "@/entities/tag";

interface ArticleCardProps {
    article: Article;
    author: Author;
    tags: Tag[];
}

export const ArticleCard = async ({
    article,
    author,
    tags,
}: ArticleCardProps) => {
    return (
        <article className="space-y-6 overflow-hidden rounded-3xl bg-white p-6">
            <ArticleHeader article={article} author={author} tags={tags} />
            <ArticleBody article={article} />
            <ReadMore article={article} />
        </article>
    );
};
