import Image from "next/image";
import moonIcon from "@icons/moon-black.svg";

export const ThemeSwitcher = () => {
    return (
        <button type="button">
            <Image src={moonIcon} alt="Сменить тему оформления" />
        </button>
    );
};
