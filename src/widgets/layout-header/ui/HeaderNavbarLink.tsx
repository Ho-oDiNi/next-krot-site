"use client";

import { cn } from "@/shared/lib/cn";
import { NavigationLinkItem } from "@/shared/lib/site-links";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderNavbarLinkProps {
    link: NavigationLinkItem;
    onClose?: () => void;
}

const HeaderNavbarLink = ({ link, onClose }: HeaderNavbarLinkProps) => {
    const currentPath = usePathname();
    const { href, label } = link;

    const isActive = currentPath === href;

    return (
        <Link
            href={href || ""}
            className={cn(
                isActive ? "font-bold text-blue-900" : "hover:opacity-70",
                "text-main",
            )}
            onClick={onClose}
        >
            {label}
        </Link>
    );
};

export default HeaderNavbarLink;
