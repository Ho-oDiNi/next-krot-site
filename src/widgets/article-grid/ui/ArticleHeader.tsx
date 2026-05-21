import { Article } from "@/entities/article";
import { Author } from "@/entities/author";
import Image from "next/image";
import defaultAvatarImg from "@icons/default-avatar.svg";
import { Tag } from "@/entities/tag";
import Link from "next/link";

interface ArticleCardProps {
    article: Article;
    author: Author;
    tags: Tag[];
}

export const ArticleHeader = ({ article, author, tags }: ArticleCardProps) => {
    return (
        <div className="md:flex-between block space-y-3 text-xs">
            <div className="flex items-center gap-3">
                <Image
                    src={author.avatarImg || defaultAvatarImg}
                    alt={author.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500">{article.datePublic}</span>
                    <span className="font-semibold">{author.name}</span>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-gray-500">Время чтения</span>
                <span>~ {article.readingTime ?? 7} мин</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-gray-500">Темы</span>
                <span className="flex gap-1 text-nowrap">
                    {tags.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/tags/${tag.slug}`}
                            className=""
                        >
                            #{tag.name}
                            {tag !== tags[tags.length - 1] && " / "}
                        </Link>
                    ))}
                </span>
            </div>
        </div>
    );
};
