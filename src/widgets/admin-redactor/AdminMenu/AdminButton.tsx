"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface AdminButtonProps {
    callback?: () => void;
    href?: string;
    children: ReactNode;
    ariaLabel?: string;
    disabled?: boolean;
}

const buttonClassName =
    "relative size-10 rounded-full bg-white transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700";

const AdminButton = ({
    callback,
    href,
    children,
    ariaLabel,
    disabled = false,
}: AdminButtonProps) => {
    if (href && !disabled) {
        return (
            <Link
                className={`${buttonClassName} flex items-center justify-center`}
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
            onClick={callback}
            aria-label={ariaLabel}
            disabled={disabled}
            type="button"
        >
            {children}
        </button>
    );
};

export default AdminButton;
