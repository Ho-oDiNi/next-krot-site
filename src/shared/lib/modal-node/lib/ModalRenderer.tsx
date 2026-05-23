"use client";

import { useModal } from "./useModal";
import { ModalSurface } from "../ui/ModalSurface";

export const ModalRenderer = () => {
    const { modalRef, closeModal, className, content, variant } = useModal();

    return (
        <ModalSurface
            ref={modalRef}
            onClose={closeModal}
            className={className}
            variant={variant}
        >
            {content}
        </ModalSurface>
    );
};
