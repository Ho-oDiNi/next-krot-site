"use client";

import { useModal } from "@/shared/lib/modal-node";

import BurgerIcon from "@icons/burger-black.svg";

import { BurgerMenu } from "./BurgerMenu";

export const BurgerButton = () => {
    const { openDialog, closeModal } = useModal();

    const handleOpen = () => {
        openDialog(<BurgerMenu onClose={closeModal} />)("w-full");
    };

    return (
        <button onClick={() => handleOpen()} className="block lg:hidden">
            <BurgerIcon
                alt="Открыть меню навигации"
                className="text-black dark:text-white"
            />
        </button>
    );
};
