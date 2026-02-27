"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import styles from "./ServiceSwitchLinkWrapper.module.css";
import ServiceSwitchLink from "./ServiceSwitchLink";
import { ServiceSwitchLinkWrapperProps } from "../model";

const ServiceSwitchLinkWrapper = ({
    href,
    isActive,
    children,
    isFirst,
    isLast,
}: ServiceSwitchLinkWrapperProps) => {
    const pathname = usePathname();
    const currentIsActive = isActive || pathname === href;

    const positionClass = isFirst
        ? cn(styles.coverLeft, styles.roundedRight)
        : isLast
          ? cn(styles.roundedLeft, styles.coverRight)
          : cn(styles.roundedLeft, styles.roundedRight);

    return (
        <div
            className={cn(
                styles.wrapper,
                currentIsActive && positionClass,
                currentIsActive && styles.active,
                !currentIsActive && "bg-white md:bg-white",
            )}
        >
            <ServiceSwitchLink href={href} isActive={isActive}>
                {children}
            </ServiceSwitchLink>
        </div>
    );
};

export default ServiceSwitchLinkWrapper;
