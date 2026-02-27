import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { FooterLinksProps } from "@/widgets/layout-footer/model";

const FooterLinks = ({ links, className = "" }: FooterLinksProps) => {
    return (
        <nav className={cn("flex flex-col gap-4", className)}>
            {links.map((link) => {
                const { href, label, prefetch, target, rel } = link;

                return (
                    <Link
                        key={label}
                        href={href}
                        className="text-main hover:opacity-70"
                        prefetch={prefetch}
                        target={target}
                        rel={rel}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default FooterLinks;
