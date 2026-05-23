"use client";

import { forwardRef, MouseEvent, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { ModalVariant } from "../model";

interface ModalSurfaceProps {
    onClose: () => void;
    children: ReactNode;
    className?: string;
    variant: ModalVariant;
}

export const ModalSurface = forwardRef<
    HTMLDialogElement | null,
    ModalSurfaceProps
>(({ onClose, children, className = "", variant }, ref) => {
    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <dialog
            ref={ref}
            onClick={handleBackdropClick}
            className={cn(
                // variant === "dialog" && "backdrop:bg-black/50",
                "fixed m-0 flex h-full max-h-none w-full max-w-none border-none bg-transparent p-0",
                className,
            )}
        >
            {children}
        </dialog>
    );
});

ModalSurface.displayName = "ModalSurface";
