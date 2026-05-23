"use client";

import { ReactNode, useCallback, useMemo, useRef, useState } from "react";

import {
    ModalContextValue,
    ModalPayload,
    ModalVariant,
    OpenModalOptions,
} from "../model";
import { ModalContext } from "./ModalContext";

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);

    const [content, setContent] = useState<ModalPayload | null>(null);
    const [className, setClassName] = useState<string>("");
    const [variant, setVariant] = useState<ModalVariant>("dialog");

    const resetModalState = useCallback(() => {
        setContent(null);
        setClassName("");
        setVariant("dialog");
    }, []);

    const openModal = useCallback(
        (nextContent: ModalPayload, options: OpenModalOptions = {}) => {
            const nextVariant = options.variant ?? "dialog";

            setContent(nextContent);
            setClassName(options.className ?? "");
            setVariant(nextVariant);

            const node = modalRef.current;

            if (!node) {
                return;
            }

            if (node.open) {
                node.close();
            }

            if (nextVariant === "dialog") {
                node.showModal();
                return;
            }

            node.show();
        },
        [],
    );

    const closeModal = useCallback(() => {
        resetModalState();
        modalRef.current?.close();
    }, [resetModalState]);

    const contextValue = useMemo<ModalContextValue>(
        () => ({
            modalRef,
            content,
            className,
            variant,
            openModal,
            closeModal,
        }),
        [content, className, variant, openModal, closeModal],
    );

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
    );
};
