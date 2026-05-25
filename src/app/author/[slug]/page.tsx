import { cn } from "@/shared/lib/cn";
import { ArticleGrid } from "@/widgets/article-grid";
import { getMockAuthor } from "@/widgets/article-grid/config";
import Image from "next/image";

const DEFAULT_AVATAR_SRC = "/icons/default-avatar.svg";

const AuthorPage = async () => {
    const author = await getMockAuthor();
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
            {/* TODO: по автору */}
            <ArticleGrid />
        </div>
    );
};

export default AuthorPage;
