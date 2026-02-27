import { ReactNode } from "react";

import { StaticImageData } from "next/image";
import { NavigationLinkItem } from "@/shared/lib/site-links";

export interface FooterBlockProps {
    title: string;
    href: string;
    children: ReactNode;
}

export interface FooterLinksProps {
    links: NavigationLinkItem[];
    className?: string;
}

export interface ContactItemProps {
    icon: StaticImageData;
    alt: string;
    href: string;
    children: ReactNode;
    prefetch?: boolean;
    target?: string;
    rel?: string;
}
