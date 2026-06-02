import { getAuthors } from "@/entities/author/api";
import { getTags } from "@/entities/tag/api";
import { cn } from "@/shared/lib/cn";
import { AdminArticleRedactor } from "@/widgets/admin-article-redactor";

const AdminArticleCreatePage = async () => {
    const [authors, availableTags] = await Promise.all([
        getAuthors(),
        getTags(),
    ]);

    return (
        <section className="space-y-6">
            <h1
                className={cn(
                    "text-center text-4xl font-bold text-slate-500 md:text-5xl",
                )}
            >
                Новая статья
            </h1>

            <AdminArticleRedactor
                article={{
                    originalSlug: undefined,
                    slug: "",
                    title: "",
                    metaTitle: "",
                    metaDescription: "",
                    previewImg: "",
                    mainText: "",
                    readingTime: "",
                    isPublished: false,
                    authorId: authors[0]?.id ?? 0,
                    tagIds: [],
                }}
                authors={authors}
                availableTags={availableTags}
            />
        </section>
    );
};

export default AdminArticleCreatePage;
