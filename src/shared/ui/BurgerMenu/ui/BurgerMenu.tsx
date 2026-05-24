"use client";

import Link from "next/link";

import { SITE_NAVIGATION_LINKS } from "@/shared/lib/site-links";
import CloseIcon from "@icons/close-black.svg";
import { SocialLinks } from "@/shared/ui/SocialLinks";
import { TagMap } from "@/shared/ui/TagMap";
import { Logo } from "../../Logo";

interface BurgerMenuProps {
    onClose: () => void;
}

export const BurgerMenu = ({ onClose }: BurgerMenuProps) => {
    return (
        <div className="w-full space-y-25 bg-white p-4 dark:bg-gray-900">
            <Link
                href="/"
                onClick={onClose}
                className="text-h3 absolute-x-center"
            >
                <Logo />
            </Link>

            <button
                onClick={onClose}
                className="h-10 max-h-5 w-10 max-w-5 rounded-full hover:opacity-70"
            >
                <CloseIcon
                    className="w-full text-black dark:text-white"
                    alt="Закрыть меню"
                />
            </button>

            <nav className="text-black dark:text-white">
                <ul className="flex-center flex-col gap-4">
                    {SITE_NAVIGATION_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={onClose}
                                className="text-h4 transition hover:opacity-70"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex-center flex-col gap-4">
                <p className="text-bold text-2xl text-black dark:text-white">
                    Наши темы
                </p>
                <TagMap />
            </div>
            <SocialLinks variant="burger" />
        </div>
    );
};
