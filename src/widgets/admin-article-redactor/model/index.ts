export interface ArticleRedactorFormData {
    originalSlug: string;
    slug: string;
    title: string;
    previewImg: string;
    mainText: string;
    readingTime: string;
    isPublished: boolean;
}

export interface UpdateArticlePayload {
    originalSlug: string;
    slug: string;
    title: string;
    previewImg: string | null;
    mainText: string;
    readingTime: number | null;
    isPublished: boolean;
}

export interface UpdateArticleResult {
    success: boolean;
    message: string;
    slug?: string;
}
