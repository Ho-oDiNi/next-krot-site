import { HTMLAttributes, ReactNode } from "react";

type StyledNodeVariant =
    | "primary"
    | "secondary"
    | "accent"
    | "service-selected";

type StyledNodeSize = "sm" | "md" | "lg" | "max";

export interface StyledSpanProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: StyledNodeVariant;
    size?: StyledNodeSize;
    children: ReactNode;
}
