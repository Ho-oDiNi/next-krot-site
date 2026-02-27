export interface Category {
    id: number;
    slug: string;
    name: string;
    serviceSlugs: string[];
    imageUrl?: string;
    position?: number;
}

export interface ServicePreview {
    id: number;
    slug: string;
    title: string;
}

export interface CategoryWithServices {
    id: number;
    slug: string;
    name: string;
    imageUrl?: string;
    position?: number;
    services: ServicePreview[];
}
