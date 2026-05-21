import QuillEditor from "@/shared/lib/react-quill";
import InputField from "../ui/InputField";
import { Service } from "@/entities/service";
import TextareaField from "../ui/TextareaField";

interface ContentDataFieldProps {
    formData: {
        title: string;
        description: string;
        mainText: string;
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

            <InputField
                label="Тег #1"
                type="text"
                value={formData.guarantee}
                onChange={(value) => onChange("guarantee", value)}
                required
            />

            <InputField
                label="Тег #2"
                type="text"
                value={formData.duration}
                onChange={(value) => onChange("duration", value)}
                required
            />
        </div>
    );
};

export default ContentDataField;
