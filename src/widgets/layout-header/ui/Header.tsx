import { Logo } from "@/shared/ui/Logo";
import { SearchBar } from "./SearchBar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { HeaderNavigation } from "./HeaderNavigation";
import { BurgerButton } from "@/shared/ui/BurgerMenu";

const Header = () => {
    return (
        <header className="flex-between fixed top-0 z-10 w-full bg-gray-200 p-6 lg:p-8 dark:bg-slate-800">
            <BurgerButton />
            <HeaderNavigation className="hidden gap-8 lg:flex dark:text-white" />
            <Logo className="lg:absolute-center" />
            <div className="flex gap-8">
                <ThemeSwitcher />
                <SearchBar />
            </div>
        </header>
    );
};

export default Header;
