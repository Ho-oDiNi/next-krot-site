import Link from "next/link";
import { ServiceWithCategory } from "@/entities/service";

type SearchResultsProps = {
    query: string;
    results: ServiceWithCategory[];
    className?: string;
};

const SearchResults = ({ query, results, className }: SearchResultsProps) => {
    if (!query) {
        return null;
    }

    return (
        <div
            className={
                className ??
                "absolute top-14 w-full rounded-xl bg-white/95 p-3 text-neutral-900 shadow-lg"
            }
        >
            {results.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {results.map(({ service, category }) => (
                        <li key={`${category.slug}:${service.slug}`}>
                            <Link
                                href={`/services/${category.slug}/${service.slug}`}
                                className="flex flex-col rounded-lg px-3 py-2 transition hover:bg-stone-200"
                            >
                                <span className="text-sm font-semibold text-neutral-900 sm:text-base">
                                    {service.shortName ?? service.title}
                                </span>
                                <span className="text-xs text-stone-500 sm:text-sm">
                                    {category.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-stone-500">
                    Ничего не найдено, попробуйте другой запрос.
                </p>
            )}
        </div>
    );
};

export default SearchResults;
