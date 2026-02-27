import { ReactNode } from "react";

export interface ServiceSwitchLinkProps {
    href: string;
    children: ReactNode;
    isActive: boolean;
}

export interface ServiceSwitchLinkWrapperProps extends ServiceSwitchLinkProps {
    isFirst: boolean;
    isLast: boolean;
}
