import { ButtonHTMLAttributes, ReactNode } from "react";

type StyledNodeVariant = "primary" | "secondary";

type StyledNodeSize = "sm" | "md" | "lg" | "max";

export interface StyledButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: StyledNodeVariant;
    size?: StyledNodeSize;
    children: ReactNode;
}
