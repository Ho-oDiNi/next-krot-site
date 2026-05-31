"use client";

import { ReactNode } from "react";

interface AdminButtonProps {
    callback?: () => void;
    children: ReactNode;
}

const AdminButton = ({ callback, children }: AdminButtonProps) => {
    return (
        <button
            className="size-10 rounded-full bg-white hover:bg-slate-300 dark:bg-slate-700"
            onClick={callback}
        >
            {children}
        </button>
    );
};

export default AdminButton;
