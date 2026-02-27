import QuillEditor from "@/shared/lib/react-quill";
import InputField from "../ui/InputField";
import { Service } from "@/entities/service";
import TextareaField from "../ui/TextareaField";
import PriceAbbreviationField from "./PriceAbbreviationField";

interface ContentDataFieldProps {
    formData: {
        title: string;
        shortName: string;
        description: string;
        contentTitle: string;
        contentDescription: string;
        mainText: string;
        price: number;
        priceAbbr: string;
        priceExplanation: string;
        guarantee: string;
        duration: string;
    };
    onChange: (field: keyof Service, value: Service[keyof Service]) => void;
}

const ContentDataField = ({ formData, onChange }: ContentDataFieldProps) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <InputField
                    label="Название"
                    type="text"
                    value={formData.title}
                    onChange={(value) => onChange("title", value)}
                    required
                />
            </div>

            <TextareaField
                label="Описание"
                value={formData.description}
                onChange={(value) => onChange("description", value)}
                rows={3}
                required
            />

            <span className="block text-sm font-medium">Основной текст</span>
            <QuillEditor
                value={formData.mainText}
                onChange={(value) => onChange("mainText", value)}
                className="rounded border"
            />
        </div>
    );
};

export default ContentDataField;
