import { isAdminServerSide } from "@/core/auth";
import { SITE_NAVIGATION_LINKS } from "@/shared/lib/site-links";
import Link from "next/link";

export const HeaderNavigation = async ({
    className,
}: {
    className?: string;
}) => {
    const isAdmin = await isAdminServerSide();
    return (
        <nav className={className}>
            {SITE_NAVIGATION_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm">
                    {link.label}
                </Link>
            ))}
            {isAdmin && (
                <Link href="/admin" className="text-sm">
                    Панель управления
                </Link>
            )}
        </nav>
    );
};
