import searchIcon from "@icons/search-white.svg";
import Image from "next/image";

const SearchButton = () => {
    return (
        <button
            type="submit"
            className="flex-center h-12 min-w-12 rounded-xl bg-red-500 text-xl font-bold text-white hover:bg-red-600 active:bg-red-400 sm:w-38"
        >
            <span className="hidden sm:block">Поиск</span>
            <Image
                src={searchIcon}
                alt="Иконка поиска"
                className="block sm:hidden"
            />
        </button>
    );
};

export default SearchButton;
