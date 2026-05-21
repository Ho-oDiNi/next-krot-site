import Image from "next/image";
import BurgerIcon from "@icons/burger-black.svg";

export const BurgerMenu = ({ className }: { className?: string }) => {
    return (
        <button className={className}>
            <Image src={BurgerIcon} alt="Открыть меню навигации" />
        </button>
    );
};
