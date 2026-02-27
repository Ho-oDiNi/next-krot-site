"use client";

import { usePathname } from "next/navigation";

import { StyledLink } from "@/shared/ui/StyledLink";
import { StyledSpan } from "@/shared/ui/StyledSpan";
import { ServiceSwitchLinkProps } from "../model";

const ServiceSwitchLink = ({
    href,
    children,
    isActive,
}: ServiceSwitchLinkProps) => {
    const pathname = usePathname();
    const currentIsActive = isActive || pathname === href;

    if (currentIsActive)
        return (
            <StyledSpan variant="service-selected" size="max">
                {children}
            </StyledSpan>
        );

    return (
        <StyledLink
            href={href}
            variant="service-possible"
            size="max"
            scroll={false}
        >
            {children}
        </StyledLink>
    );
};

export default ServiceSwitchLink;
