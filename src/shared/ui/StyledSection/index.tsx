import { cn } from "@/shared/lib/cn";
import { ReactNode } from "react";

export interface StyledSectionProps {
    isSecondary?: boolean;
    sectionClassName?: string;
    divClassName?: string;
    children: ReactNode;
}

const StyledSection = ({
    isSecondary,
    sectionClassName = "",
    divClassName = "flex-center flex-col",
    children,
}: StyledSectionProps) => {
    const bgColor = isSecondary ? "bg-slate-200" : "bg-white";

    return (
        <section
            className={cn(bgColor, sectionClassName, "px-4 py-12 md:py-16")}
        >
            <div className={cn(divClassName, "container mx-auto gap-10")}>
                {children}
            </div>
        </section>
    );
};

export default StyledSection;
