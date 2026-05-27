import { Author } from "@/entities/author";
import { Tag } from "@/entities/tag";

export interface Article {
    id: number;
    slug: string;
    title: string;
    previewImg: string | null;
    likesCount: number;
    mainText: string;
    updatedAt: string;
    readingTime: number | null;
}

export interface ArticleWithRelations extends Article {
    author: Author;
    tags: Tag[];
}
