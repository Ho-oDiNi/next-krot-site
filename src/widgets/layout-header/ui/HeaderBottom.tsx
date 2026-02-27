import burgerIcon from "@icons/burger-blue-dark.svg";
import Image from "next/image";

import HeaderNavbar from "./HeaderNavbar";
import Logo from "@/shared/ui/Logo";

const HeaderBottom = () => {
    return (
        <div className="bg-white px-(--space-inside-x)">
            <div className="flex-between container mx-auto flex-row-reverse py-3 md:flex-row">
                <Logo
                    className="flex-center gap-8"
                    imageClassName="h-8 w-auto md:h-8"
                    hideTextOnMobile
                />
                <HeaderNavbar />
            </div>
        </div>
    );
};

export default HeaderBottom;
