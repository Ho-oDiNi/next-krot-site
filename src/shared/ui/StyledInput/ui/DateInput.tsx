"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import calendarIcon from "@icons/calendar-blur.svg";

import styles from "./InputField.module.css";

type DateInputProps = {
    id: string;
    label: string;
    name?: string;
    required?: boolean;
    className?: string;
    min?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    error?: string;
};

const DATE_MASK = "ДД.ММ";

const formatDisplayValue = (digits: string) => {
    const trimmed = digits.slice(0, 4);

    if (trimmed.length <= 2) return trimmed;
    return `${trimmed.slice(0, 2)}.${trimmed.slice(2)}`;
};

const normalizeDayMonth = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    return formatDisplayValue(digits);
};

const toIsoDate = (displayValue: string) => {
    const [day, month] = displayValue.split(".");
    if (!day || !month || day.length !== 2 || month.length !== 2) return "";

    const year = new Date().getFullYear();
    const iso = `${year}-${month}-${day}`;

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    const validDay = String(date.getDate()).padStart(2, "0");
    const validMonth = String(date.getMonth() + 1).padStart(2, "0");

    if (validDay !== day || validMonth !== month) return "";

    return iso;
};

const fromIsoToDisplay = (iso: string) => {
    const [, month, day] = iso.split("-");
    if (!day || !month) return "";
    return `${day}.${month}`;
};

export const DateInput = ({
    id,
    label,
    name,
    required = false,
    className,
    min,
    value = "",
    onChange,
    onBlur,
    error,
}: DateInputProps) => {
    const hiddenDateRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const openPicker = () => {
        hiddenDateRef.current?.showPicker?.();
        hiddenDateRef.current?.focus();
    };

    const handleTextChange = (inputValue: string) => {
        const nextValue = normalizeDayMonth(inputValue);
        onChange?.(nextValue);

        if (hiddenDateRef.current) {
            hiddenDateRef.current.value = toIsoDate(nextValue) || "";
        }
    };

    const handleNativeDateChange = (isoValue: string) => {
        onChange?.(fromIsoToDisplay(isoValue));
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
                        {DATE_MASK.slice(displayValue.length)}
                    </span>
                </div>
            )}

            <button
                type="button"
                className={styles.iconButton}
                onClick={openPicker}
                aria-label="Выбрать дату"
            >
                <Image src={calendarIcon} alt="" aria-hidden="true" />
            </button>

            <input
                ref={hiddenDateRef}
                type="date"
                tabIndex={-1}
                aria-hidden="true"
                min={min}
                className={styles.nativePickerInput}
                value={toIsoDate(displayValue)}
                onChange={(e) => handleNativeDateChange(e.target.value)}
            />

            {error && (
                <div className={styles.errorText}>
                    <p id={errorId}>{error}</p>
                </div>
            )}
        </div>
    );
};
