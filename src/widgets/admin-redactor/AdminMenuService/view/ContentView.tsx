import BackButton from "../ui/BackButton";
import ContentDataField from "../fields/ContentDataField";
import { BaseViewProps } from "@/widgets/admin-redactor/model/adminRedactor.types";

const ContentView = ({ formData, onChange, onBack }: BaseViewProps) => (
    <div>
        <BackButton onBack={onBack} />
        <ContentDataField
            formData={{
                title: formData.title,
                description: formData.description,
                mainText: formData.mainText,
                guarantee: formData.guarantee,
                duration: formData.duration,
            }}
            onChange={onChange}
        />
    </div>
);

export default ContentView;
