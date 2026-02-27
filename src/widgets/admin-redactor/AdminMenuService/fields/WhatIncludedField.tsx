interface WhatIncludedFieldProps {
    label: string;
    items: string[];
    onAdd: () => void;
    onChange: (index: number, value: string) => void;
    onRemove: (index: number) => void;
    rows?: number;
}

const WhatIncludedField = ({
    label,
    items,
    onAdd,
    onChange,
    onRemove,
    rows = 2,
}: WhatIncludedFieldProps) => {
    return (
        <div>
            <div className="flex items-center justify-between pb-2">
                <label className="block text-sm font-medium">{label}</label>
                <button type="button" onClick={onAdd} className="text-blue-600">
                    + Add
                </button>
            </div>
            {items.map((item, index) => (
                <div key={index} className="mb-2 flex gap-2">
                    <textarea
                        value={item}
                        onChange={(e) => onChange(index, e.target.value)}
                        className="flex-1 rounded border p-2"
                        rows={rows}
                    />
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="text-red-600"
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
};

export default WhatIncludedField;
