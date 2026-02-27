import { AnchorHTMLAttributes, ReactNode } from "react";

type StyledNodeVariant =
    | "primary"
    | "secondary"
    | "whatsapp"
    | "dark"
    | "white"
    | "service-possible";

type StyledNodeSize = "sm" | "md" | "lg" | "max";

export interface StyledLinkProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    variant?: StyledNodeVariant;
    size?: StyledNodeSize;
    children: ReactNode;
    scroll?: boolean;
}
