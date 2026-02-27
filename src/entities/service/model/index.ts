import { Category } from "@/entities/category";
export interface Service {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    mainText: string;
    guarantee: string;
    duration: string;
}

export interface ServiceWithCategory {
    service: Service;
    category: Category;
}
