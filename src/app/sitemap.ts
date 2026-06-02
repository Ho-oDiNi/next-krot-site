import { getBaseUrl } from "@/core/domains";
import { getAllPublishedArticles } from "@/entities/article/api";
import { getAuthors } from "@/entities/author/api";
import { getTags } from "@/entities/tag/api";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = await getBaseUrl();

    const staticPages = [{ url: baseUrl }, { url: `${baseUrl}/about` }];

    if (process.env.BUILD_TIME) {
        return [...staticPages];
    }

    const [articles, tags, authors] = await Promise.all([
        getAllPublishedArticles(),
        getTags(),
        getAuthors(),
    ]);

    const articlePages = articles.map((article) => ({
        url: `${baseUrl}/article/${article.slug}`,
    }));

    const tagPages = tags.map((tag) => ({
        url: `${baseUrl}/tag/${tag.slug}`,
    }));

    const authorPages = authors.map((author) => ({
        url: `${baseUrl}/author/${author.slug}`,
    }));

    return [...staticPages, ...articlePages, ...tagPages, ...authorPages];
}

export const dynamic = "force-dynamic";
