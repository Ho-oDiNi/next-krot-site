import { Category } from "@/entities/category";
import { ComparisonImageSet } from "@/features/comparison-card";

export interface ServiceMetaData {
    slug: string;
    shortName?: string;
    metaTitle: string;
    metaDescription: string;
}

export interface ServiceMainContent {
    shortName?: string;
    title: string;
    description: string;
    contentTitle?: string;
    contentDescription?: string;
    mainText: string;
    guarantee: string;
    duration: string;
}

export interface ServiceFeatureData {
    whatIncluded: string[];
    materials: string[];
}

export interface ServicePriceData {
    price: number;
    priceAbbr: string;
    priceExplanation?: string;
}

export interface ServiceFaqData {
    faqDescription: string;
    faqItems: [string, string][];
}

export interface Service
    extends ServiceMetaData,
        ServiceMainContent,
        ServiceFeatureData,
        ServicePriceData,
        ServiceFaqData {
    id: number;
    comparedImages?: ComparisonImageSet;
    categoryId?: number;
    categorySlug?: string;
}

export interface ServiceWithCategory {
    service: Service;
    category: Category;
}
