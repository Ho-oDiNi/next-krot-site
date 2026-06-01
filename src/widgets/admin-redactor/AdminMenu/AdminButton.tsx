"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface AdminButtonProps {
    onClick?: () => void;
    href?: string;
    children: ReactNode;
    ariaLabel?: string;
    disabled?: boolean;
}

const buttonClassName =
    "relative flex size-10 items-center justify-center rounded-full bg-white transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700";

const AdminButton = ({
    onClick,
    href,
    children,
    ariaLabel,
    disabled = false,
}: AdminButtonProps) => {
    if (href && !disabled) {
        return (
            <Link
                className={buttonClassName}
                href={href}
                aria-label={ariaLabel}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={buttonClassName}
            onClick={onClick}
            aria-label={ariaLabel}
            disabled={disabled}
            type="button"
        >
            {children}
        </button>
    );
};

export default AdminButton;
