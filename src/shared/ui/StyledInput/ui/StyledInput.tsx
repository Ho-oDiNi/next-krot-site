import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./InputField.module.css";

export interface StyledInputProps extends ComponentPropsWithoutRef<"input"> {
    id: string;
    label: string;
    error?: string;
}

export const StyledInput = ({
    id,
    label,
    className,
    required = false,
    error,
    ...props
}: StyledInputProps) => {
    const errorId = `${id}-error`;

    return (
        <div className={styles.wrapper}>
            <input
                id={id}
                placeholder=" "
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={cn(
                    styles.input,
                    error && styles.inputError,
                    className,
                )}
                {...props}
            />

            <label htmlFor={id} className={styles.label}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            {error && (
                <div className={styles.errorText}>
                    <p id={errorId}>{error}</p>
                </div>
            )}
        </div>
    );
};
