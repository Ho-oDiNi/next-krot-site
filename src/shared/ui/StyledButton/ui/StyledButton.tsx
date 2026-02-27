import styles from "./StyledButton.module.css";
import { cn } from "@/shared/lib/cn";
import { StyledButtonProps } from "../model";

const StyledButton = (props: StyledButtonProps) => {
    const {
        variant = "primary",
        size = "lg",
        className = "",
        children,
        ...restProps
    } = props;

    const buttonClasses = cn(
        styles.base,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        className,
    );

    return (
        <button className={buttonClasses} {...restProps}>
            {children}
        </button>
    );
};

export default StyledButton;
