import { SITE_NAVIGATION_LINKS } from "@/shared/lib/site-links";
import HeaderNavbarLink from "./HeaderNavbarLink";

const HeaderNavbar = () => {
    return (
        <nav className="md:flex-center hidden gap-8">
            {SITE_NAVIGATION_LINKS.map((link) => (
                <HeaderNavbarLink key={link.href ?? link.label} link={link} />
            ))}
        </nav>
    );
};

export default HeaderNavbar;
