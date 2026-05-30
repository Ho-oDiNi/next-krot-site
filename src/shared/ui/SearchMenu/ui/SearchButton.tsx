"use client";

import { useModal } from "@/shared/lib/modal-node";
import SearchIcon from "@icons/search-black.svg";
import { SearchMenu } from "./SearchMenu";

export const SearchButton = () => {
    const { openDialog, closeModal } = useModal();

    const handleOpen = () => {
        openDialog(<SearchMenu onClose={closeModal} />)(
            "mt-22 md:mt-24 backdrop:bg-transparent",
        );
    };
    return (
        <button
            type="button"
            className="flex-between rounded-full lg:h-10 lg:w-60 lg:bg-white lg:py-3 lg:pr-3 lg:pl-4"
            onClick={() => handleOpen()}
        >
            <span className="hidden text-xs lg:block">Искать</span>
            <SearchIcon
                alt="Поиск статей"
                className="text-black dark:text-white md:dark:text-black"
            />
        </button>
    );
};
