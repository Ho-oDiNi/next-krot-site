"use client";

import { useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./InputField.module.css";

type TimeInputProps = {
    id: string;
    label: string;
    name?: string;
    required?: boolean;
    className?: string;
    min?: string;
    max?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    error?: string;
};

const TIME_MASK = "--/--";

const ClockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
            d="M12 7V12L15 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const formatDisplayValue = (digits: string) => {
    const trimmed = digits.slice(0, 4);

    if (trimmed.length <= 2) return trimmed;
    return `${trimmed.slice(0, 2)}:${trimmed.slice(2)}`;
};

const normalizeTime = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    return formatDisplayValue(digits);
};

const toNativeTime = (displayValue: string) => {
    const [hours, minutes] = displayValue.split(":");

    if (!hours || !minutes || hours.length !== 2 || minutes.length !== 2) {
        return "";
    }

    const hoursNum = Number(hours);
    const minutesNum = Number(minutes);

    if (
        Number.isNaN(hoursNum) ||
        Number.isNaN(minutesNum) ||
        hoursNum < 0 ||
        hoursNum > 23 ||
        minutesNum < 0 ||
        minutesNum > 59
    ) {
        return "";
    }

    return `${hours}:${minutes}`;
};

const fromNativeTime = (value: string) => {
    if (!value) return "";
    return value.slice(0, 5);
};

export const TimeInput = ({
    id,
    label,
    name,
    required = false,
    className,
    min,
    max,
    value = "",
    onChange,
    onBlur,
    error,
}: TimeInputProps) => {
    const hiddenTimeRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const openPicker = () => {
        hiddenTimeRef.current?.showPicker?.();
        hiddenTimeRef.current?.focus();
    };

    const handleTextChange = (inputValue: string) => {
        const nextValue = normalizeTime(inputValue);
        onChange?.(nextValue);

        if (hiddenTimeRef.current) {
            hiddenTimeRef.current.value = toNativeTime(nextValue) || "";
        }
    };

    const handleNativeTimeChange = (nativeValue: string) => {
        onChange?.(fromNativeTime(nativeValue));
    };

    const errorId = `${id}-error`;
    const displayValue = value;

    return (
        <div className={styles.wrapper}>
            <input
                id={id}
                name={name}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder=" "
                value={displayValue}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onChange={(e) => handleTextChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    onBlur?.();
                }}
                className={cn(
                    styles.input,
                    styles.pickerInput,
                    error && styles.inputError,
                    className,
                )}
            />

            <label htmlFor={id} className={styles.label}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            {isFocused && displayValue.length < 5 && (
                <div className={styles.ghost} aria-hidden="true">
                    <span className={styles.ghostTyped}>{displayValue}</span>
                    <span className={styles.ghostRest}>
                        {TIME_MASK.slice(displayValue.length)}
                    </span>
                </div>
            )}

            <button
                type="button"
                className={styles.iconButton}
                onClick={openPicker}
                aria-label="Выбрать время"
            >
                <ClockIcon />
            </button>

            <input
                ref={hiddenTimeRef}
                type="time"
                tabIndex={-1}
                aria-hidden="true"
                min={min}
                max={max}
                className={styles.nativePickerInput}
                value={toNativeTime(displayValue)}
                onChange={(e) => handleNativeTimeChange(e.target.value)}
            />

            {error && (
                <div className={styles.errorText}>
                    <p id={errorId}>{error}</p>
                </div>
            )}
        </div>
    );
};
