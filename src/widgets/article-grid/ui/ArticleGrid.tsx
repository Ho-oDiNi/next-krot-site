import { getMockArticles, getMockAuthor, getMockTags } from "../config";
import { ArticleCard } from "./ArticleCard";
import { Fragment } from "react/jsx-runtime";

export const ArticleGrid = async () => {
    const articles = await getMockArticles();
    const author = await getMockAuthor();
    const tags = await getMockTags();

    return (
        <div className="w-full space-y-6">
            {articles.map((article) => (
                <Fragment key={article.id}>
                    <ArticleCard
                        article={article}
                        author={author}
                        tags={tags}
                    />
                </Fragment>
            ))}
        </div>
    );
};
