export interface Article {
    id: number;
    slug: string;
    title: string;
    previewImg: string | null;
    likesCount: number;
    mainText: string;
    datePublic: string;
    readingTime: number | null;
}
