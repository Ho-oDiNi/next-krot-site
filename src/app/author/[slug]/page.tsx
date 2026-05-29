import { notFound } from "next/navigation";
import Image from "next/image";

import { cn } from "@/shared/lib/cn";
import { ArticleGrid } from "@/widgets/article-grid";
import { getAuthorBySlug } from "@/entities/author/api";

const DEFAULT_AVATAR_SRC = "/icons/default-avatar.svg";

interface AuthorPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const AuthorPage = async ({ params }: AuthorPageProps) => {
    const { slug } = await params;

    const author = await getAuthorBySlug(slug);

    if (!author) {
        notFound();
    }

    return (
        <div className="flex-center flex-col gap-6">
            <Image
                src={author.avatarImg || DEFAULT_AVATAR_SRC}
                alt={author.name}
                width={144}
                height={144}
                className="rounded-full"
            />

            <hgroup className="flex-center flex-col gap-6">
                <h1
                    className={cn(
                        "text-center text-3xl font-bold md:text-4xl dark:text-white",
                    )}
                >
                    {author.name}
                </h1>

                <p className="text-center text-lg dark:text-white">
                    {author.description}
                </p>
            </hgroup>

            <ArticleGrid filters={{ authorId: author.id }} />
        </div>
    );
};

export default AuthorPage;
