interface TextareaFieldProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    rows?: number;
    required?: boolean;
}

const TextareaField = ({
    label,
    value = "",
    onChange,
    rows = 3,
    required = false,
}: TextareaFieldProps) => {
    return (
        <label className="block text-sm font-medium">
            {label}
            {required ? <span className="text-red-600"> *</span> : <></>}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full rounded border p-2"
                rows={rows}
                required={required}
            />
        </label>
    );
};

export default TextareaField;
