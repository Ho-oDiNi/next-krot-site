"use client";

import { useState } from "react";

import { Article } from "@/entities/article";

import { ArticleBody } from "./ArticleBody";
import { ReadMore } from "./ReadMore";

export const ArticlePreview = ({ article }: { article: Article }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <>
            <ArticleBody article={article} isExpanded={isExpanded} />

            <ReadMore
                article={article}
                isExpanded={isExpanded}
                onToggle={handleToggle}
            />
        </>
    );
};
