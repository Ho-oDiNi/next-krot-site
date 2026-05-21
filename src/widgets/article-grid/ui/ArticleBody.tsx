import { Article } from "@/entities/article";
import { cn } from "@/shared/lib/cn";
import Image from "next/image";
import defaultImg from "@images/mockImg.png";

export const ArticleBody = ({ article }: { article: Article }) => {
    return (
        <>
            <Image
                src={article.previewImg ?? defaultImg}
                alt={article.title}
                height={200}
                width={404}
                className="h-80 w-full rounded-xl object-cover"
            />
            <div>
                <h2
                    className={cn(
                        "text-h3 mb-6 text-2xl font-bold md:text-3xl",
                    )}
                >
                    {article.title}
                </h2>
                <div className="space-y-2 text-base md:text-lg">
                    {article.mainText}
                </div>
            </div>
        </>
    );
};
