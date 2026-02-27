import InputField from "../ui/InputField";
import TextareaField from "../ui/TextareaField";
import { Service } from "@/entities/service";

interface MetaDataFieldProps {
    formData: {
        slug: string;
        metaTitle: string;
        metaDescription: string;
    };
    onChange: (field: keyof Service, value: Service[keyof Service]) => void;
}

const MetaDataField = ({ formData, onChange }: MetaDataFieldProps) => {
    return (
        <div className="space-y-4">
            <InputField
                label="Slug"
                type="text"
                value={formData.slug}
                onChange={(value) => onChange("slug", value)}
                required
            />
            <InputField
                label="Meta Title"
                type="text"
                value={formData.metaTitle}
                onChange={(value) => onChange("metaTitle", value)}
                required
            />
            <TextareaField
                label="Meta Description"
                value={formData.metaDescription}
                onChange={(value) => onChange("metaDescription", value)}
                rows={3}
                required
            />
        </div>
    );
};

export default MetaDataField;
