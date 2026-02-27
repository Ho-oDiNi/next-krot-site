import { SubdomainProps } from "../model";
import HeaderBottom from "./HeaderBottom";

const Header = ({ cityName }: SubdomainProps) => {
    return (
        <header>
            <HeaderBottom />
        </header>
    );
};

export default Header;
