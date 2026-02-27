import { cn } from "@/shared/lib/cn";
import { StyledSpanProps } from "../model";
import styles from "./StyledSpan.module.css";

const StyledSpan = (props: StyledSpanProps) => {
    const {
        variant = "primary",
        size = "lg",
        className = "",
        children,
        ...restProps
    } = props;

    const spanClasses = cn(
        styles.base,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        className,
    );

    return (
        <span className={spanClasses} {...restProps}>
            {children}
        </span>
    );
};

export default StyledSpan;
