import { useEffect } from "react";

const PRICE_ABBREVIATION_OPTIONS = [
    "руб.",
    "руб. п.м.",
    "руб. кв.м.",
] as const;

export type PriceAbbreviationOption =
    (typeof PRICE_ABBREVIATION_OPTIONS)[number];

const PRICE_ABBREVIATION_EXPLANATION: Record<PriceAbbreviationOption, string> =
    {
        "руб.": "рублей",
        "руб. п.м.": "рублей за погонный метр",
        "руб. кв.м.": "рублей за квадратный метр",
    };

interface PriceAbbreviationFieldProps {
    label: string;
    value: string;
    onChange: (abbr: PriceAbbreviationOption, explanation: string) => void;
    required?: boolean;
}

const PriceAbbreviationField = ({
    label,
    value,
    onChange,
    required = false,
}: PriceAbbreviationFieldProps) => {
    const options = [...PRICE_ABBREVIATION_OPTIONS];
    const normalizedValue = options.includes(value as PriceAbbreviationOption)
        ? (value as PriceAbbreviationOption)
        : PRICE_ABBREVIATION_OPTIONS[0];

    useEffect(() => {
        if (value !== normalizedValue) {
            onChange(
                normalizedValue,
                PRICE_ABBREVIATION_EXPLANATION[normalizedValue],
            );
        }
    }, [normalizedValue, onChange, value]);

    return (
        <label className="block text-sm font-medium">
            {label}{" "}
            {required ? <span className="text-red-600"> *</span> : <></>}
            <select
                className="mt-2 w-full truncate rounded border p-3"
                value={normalizedValue}
                onChange={(event) => {
                    const selectedAbbreviation = event.target
                        .value as PriceAbbreviationOption;
                    onChange(
                        selectedAbbreviation,
                        PRICE_ABBREVIATION_EXPLANATION[selectedAbbreviation],
                    );
                }}
                required={required}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
};

export const getPriceExplanation = (
    abbreviation: PriceAbbreviationOption,
): string => PRICE_ABBREVIATION_EXPLANATION[abbreviation];

export default PriceAbbreviationField;
