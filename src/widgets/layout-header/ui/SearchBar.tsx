import SearchIcon from "@icons/search-black.svg";

export const SearchBar = () => {
    return (
        <button
            type="button"
            className="flex-between rounded-full lg:h-10 lg:w-60 lg:bg-white lg:py-3 lg:pr-3 lg:pl-4"
        >
            <span className="hidden text-xs lg:block">Искать</span>
            <SearchIcon alt="Поиск статей" />
        </button>
    );
};
