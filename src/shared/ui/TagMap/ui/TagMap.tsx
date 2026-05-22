import Link from "next/link";

import { getMockTags } from "@/widgets/article-grid/config";

export const TagMap = async () => {
    const tags = await getMockTags();

    return (
        <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
                <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="rounded-full bg-slate-300 px-4 py-2 text-sm whitespace-nowrap"
                >
                    {tag.name}
                </Link>
            ))}
        </div>
    );
};
