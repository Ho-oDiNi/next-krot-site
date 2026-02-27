interface InputFieldProps {
    label: string;
    type?: "text" | "number";
    value?: string | number;
    placeholder?: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const InputField = ({
    label,
    type = "text",
    value = "",
    placeholder = "",
    onChange,
    required = false,
}: InputFieldProps) => {
    return (
        <label className="block text-sm font-medium">
            {label}{" "}
            {required ? <span className="text-red-600"> *</span> : <></>}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full truncate rounded border p-3"
                required={required}
            />
        </label>
    );
};

export default InputField;
