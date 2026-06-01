export interface ArticleRedactorFormData {
    originalSlug?: string;
    slug: string;
    title: string;
    previewImg: string;
    mainText: string;
    readingTime: string;
    isPublished: boolean;
    authorId: number;
    tagIds: number[];
}

export interface UpdateArticlePayload {
    originalSlug?: string;
    slug: string;
    title: string;
    previewImg: string | null;
    mainText: string;
    previewImageFile?: File | null;
    isPublished: boolean;
    authorId: number;
    tagIds: number[];
}

export interface UpdateArticleResult {
    success: boolean;
    message: string;
    slug?: string;
}
