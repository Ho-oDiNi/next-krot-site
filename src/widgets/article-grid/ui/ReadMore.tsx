import { Article } from "@/entities/article";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import Image from "next/image";
import likeIcon from "@icons/like.svg";

export const ReadMore = ({ article }: { article: Article }) => {
    return (
        <div className="flex-between">
            <Link
                href={`/articles/${article.slug}`}
                className={cn(
                    "inline-block rounded-full bg-gray-900 px-15 py-4 text-xs text-white sm:px-20",
                )}
            >
                Читать дальше
            </Link>
            <div className="flex gap-3">
                <Image src={likeIcon} className="size-6" alt="Поставить лайк" />
                <span className="text-sm text-gray-500">
                    {article.likesCount}
                </span>
            </div>
        </div>
    );
};
