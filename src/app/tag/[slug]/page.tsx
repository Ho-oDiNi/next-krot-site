import { notFound } from "next/navigation";

import { cn } from "@/shared/lib/cn";
import { ArticleGrid } from "@/widgets/article-grid";
import { getTagBySlug } from "@/entities/tag/api";

interface AuthorPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const TagPage = async ({ params }: AuthorPageProps) => {
    const { slug } = await params;

    const tag = await getTagBySlug(slug);

    if (!tag) {
        notFound();
    }

    return (
        <div className="flex-center flex-col">
            <h1
                className={cn(
                    "mb-6 text-center text-4xl font-bold text-slate-500 md:text-5xl",
                )}
            >
                {tag.name}
            </h1>

            <ArticleGrid filters={{ tagId: tag.id }} />
        </div>
    );
};

export default TagPage;
