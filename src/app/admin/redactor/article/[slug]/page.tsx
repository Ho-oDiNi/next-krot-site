import { getArticleBySlug } from "@/entities/article/api";
import { cn } from "@/shared/lib/cn";
import { AdminArticleRedactor } from "@/widgets/admin-article-redactor";
import { notFound } from "next/navigation";

interface AdminArticleRedactorPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const AdminArticleRedactorPage = async ({
    params,
}: AdminArticleRedactorPageProps) => {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <section className="space-y-6">
            <h1
                className={cn(
                    "text-center text-4xl font-bold text-slate-500 md:text-5xl",
                )}
            >
                Редактирование статьи
            </h1>

            <AdminArticleRedactor
                article={{
                    originalSlug: article.slug,
                    slug: article.slug,
                    title: article.title,
                    previewImg: article.previewImg ?? "",
                    mainText: article.mainText,
                    readingTime: article.readingTime?.toString() ?? "",
                    isPublished: article.isPublished,
                }}
                author={article.author}
                tags={article.tags}
            />
        </section>
    );
};

export default AdminArticleRedactorPage;
