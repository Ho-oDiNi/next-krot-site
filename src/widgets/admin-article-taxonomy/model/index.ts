import type { Author } from "@/entities/author";
import type { Tag } from "@/entities/tag";

export type ArticleTaxonomyEntity = "author" | "tag";

export interface ArticleTaxonomyFormData {
    id?: number;
    name: string;
    slug: string;
    description?: string;
    avatarImg?: string;
    avatarImageFile?: File | null;
}

export interface ArticleTaxonomyResult {
    success: boolean;
    message: string;
    author?: Author;
    tag?: Tag;
    id?: number;
}
