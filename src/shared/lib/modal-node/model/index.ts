import { ReactElement, RefObject } from "react";

export type ModalVariant = "dialog" | "popup";

export type ModalPayload = ReactElement;

export interface OpenModalOptions {
    className?: string;
    variant?: ModalVariant;
}

export interface ModalContextValue {
    modalRef: RefObject<HTMLDialogElement | null>;
    content: ModalPayload | null;
    className?: string;
    variant: ModalVariant;
    openModal: (content: ModalPayload, options?: OpenModalOptions) => void;
    closeModal: () => void;
}
