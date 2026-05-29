import { Author } from "@/entities/author";
import { Tag } from "@/entities/tag";

export interface Article {
    id: number;
    slug: string;
    title: string;
    previewImg: string | null;
    likesCount: number;
    mainText: string;
    readingTime: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArticleWithRelations extends Article {
    author: Author;
    tags: Tag[];
}
