interface FaqItemsFieldProps {
    items: [string, string][];
    onAdd: () => void;
    onChange: (index: number, type: 0 | 1, value: string) => void;
    onRemove: (index: number) => void;
}

const FaqItemsField = ({
    items,
    onAdd,
    onChange,
    onRemove,
}: FaqItemsFieldProps) => {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">FAQ Items</label>
                <button type="button" onClick={onAdd} className="text-blue-600">
                    + Add FAQ
                </button>
            </div>
            {items.map(([question, answer], index) => (
                <div
                    key={index}
                    className="mb-6 rounded border bg-gray-100 p-3"
                >
                    <div className="mb-2 flex justify-between">
                        <span className="font-medium">FAQ #{index + 1}</span>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-red-600"
                        >
                            X
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Question"
                        value={question}
                        onChange={(e) => onChange(index, 0, e.target.value)}
                        className="mb-2 w-full truncate rounded border p-2"
                    />
                    <textarea
                        placeholder="Answer"
                        value={answer}
                        onChange={(e) => onChange(index, 1, e.target.value)}
                        className="w-full rounded border p-2"
                        rows={6}
                    />
                </div>
            ))}
        </div>
    );
};

export default FaqItemsField;
