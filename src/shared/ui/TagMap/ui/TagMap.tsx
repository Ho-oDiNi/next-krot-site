"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag } from "@/entities/tag";

export const TagMap = ({ onClick }: { onClick?: () => void }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch("/api/tags");

                if (!response.ok) {
                    throw new Error("Failed to fetch tags");
                }

                const data: Tag[] = await response.json();

                setTags(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, []);

    if (isLoading) {
        return <div className="text-sm opacity-60">Загрузка тем...</div>;
    }

    if (!tags.length) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
                <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="rounded-full bg-slate-300 px-4 py-2 text-sm whitespace-nowrap"
                    onClick={onClick}
                >
                    {tag.name}
                </Link>
            ))}
        </div>
    );
};
