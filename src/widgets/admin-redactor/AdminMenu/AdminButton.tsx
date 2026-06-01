"use client";

import { ReactNode } from "react";

interface AdminButtonProps {
    callback?: () => void;
    children: ReactNode;
    ariaLabel?: string;
}

const AdminButton = ({ callback, children, ariaLabel }: AdminButtonProps) => {
    return (
        <button
            className="size-10 rounded-full bg-white hover:bg-slate-300 dark:bg-slate-700"
            onClick={callback}
            aria-label={ariaLabel}
            type="button"
        >
            {children}
        </button>
    );
};

export default AdminButton;
