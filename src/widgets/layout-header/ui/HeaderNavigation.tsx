import { SITE_NAVIGATION_LINKS } from "@/shared/lib/site-links";
import Link from "next/link";

export const HeaderNavigation = ({ className }: { className?: string }) => {
    return (
        <nav className={className}>
            {SITE_NAVIGATION_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm">
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};
