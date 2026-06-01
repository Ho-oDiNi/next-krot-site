import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./InputField.module.css";

export interface StyledTextareaProps
    extends ComponentPropsWithoutRef<"textarea"> {
    id: string;
    label: string;
    error?: string;
}

export const StyledTextarea = ({
    id,
    label,
    className,
    required = false,
    error,
    rows = 3,
    onInput,
    ...props
}: StyledTextareaProps) => {
    const errorId = `${id}-error`;

    const handleAutoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;

        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;

        onInput?.(e);
    };

    return (
        <div className={styles.wrapperTextarea}>
            <textarea
                id={id}
                placeholder=" "
                rows={rows}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onInput={handleAutoResize}
                className={cn(
                    styles.input,
                    styles.textarea,
                    error && styles.inputError,
                    className,
                )}
                {...props}
            />

            <label htmlFor={id} className={styles.labelTextarea}>
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
