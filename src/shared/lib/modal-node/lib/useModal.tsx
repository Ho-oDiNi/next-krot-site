"use client";

import { useContext } from "react";

import { ModalContext } from "./ModalContext";
import { ModalPayload } from "../model";

export const useModal = () => {
    const context = useContext(ModalContext);

    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    const openDialog = (content: ModalPayload) => (className?: string) => {
        context.openModal(content, {
            variant: "dialog",
            className,
        });
    };

    const openPopup = (content: ModalPayload) => (className?: string) => {
        context.openModal(content, {
            variant: "popup",
            className,
        });
    };

    return {
        ...context,
        openDialog,
        openPopup,
    };
};
