import { cn } from "@/shared/lib/cn";

export interface StyledInputProps {
    label: string;
    name: string;
    type: string;
    inputMode: "tel" | "text";
    placeholder: string;
    bgColor: string;
}

const StyledInput = ({
    label,
    name,
    type,
    inputMode,
    bgColor,
    placeholder,
}: StyledInputProps) => {
    return (
        <label className="flex flex-col gap-4">
            {label}
            <input
                name={name}
                type={type}
                inputMode={inputMode}
                className={cn("w-full rounded-2xl px-4 py-3", bgColor)}
                placeholder={placeholder}
                autoComplete="on"
                required
            />
        </label>
    );
};

export default StyledInput;
