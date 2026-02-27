"use client";

import { FormEvent, useMemo, useState } from "react";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";
import { ServiceWithCategory } from "@/entities/service";
import { useRouter } from "next/navigation";
import SearchResults from "./SearchResults";

const normalizeSearchText = (value: string) => value.trim().toLowerCase();

type SearchBarProps = {
    services: ServiceWithCategory[];
};

const SearchBar = ({ services }: SearchBarProps) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");

    const normalizedSearch = normalizeSearchText(searchValue);

    const filteredServices = useMemo(() => {
        if (!normalizedSearch) return [];

        return services.filter(({ service, category }) => {
            const normalizedTitle = normalizeSearchText(service.title);
            const normalizedCategory = normalizeSearchText(category.name);

            return (
                normalizedTitle.includes(normalizedSearch) ||
                normalizedCategory.includes(normalizedSearch)
            );
        });
    }, [normalizedSearch, services]);

    const visibleResults = useMemo(
        () => filteredServices.slice(0, 6),
        [filteredServices],
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (visibleResults.length === 0) return;

        const targetService = visibleResults[0];
        router.push(
            `/services/${targetService.category.slug}/${targetService.service.slug}`,
        );
    };

    return (
        <div className="relative z-1 flex w-full max-w-2xl flex-col gap-3">
            <form className="flex-center w-full gap-3" onSubmit={handleSubmit}>
                <SearchInput value={searchValue} onChange={setSearchValue} />
                <SearchButton />
            </form>

            <SearchResults query={normalizedSearch} results={visibleResults} />
        </div>
    );
};

export default SearchBar;
