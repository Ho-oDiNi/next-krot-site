import BackButton from "../ui/BackButton";
import ContentDataField from "../fields/ContentDataField";
import { BaseViewProps } from "@/widgets/admin-redactor/model/adminRedactor.types";

const ContentView = ({ formData, onChange, onBack }: BaseViewProps) => (
    <div>
        <BackButton onBack={onBack} />
        <ContentDataField
            formData={{
                title: formData.title as string,
                shortName: formData.shortName as string,
                description: formData.description as string,
                contentTitle: formData.contentTitle as string,
                contentDescription: formData.contentDescription as string,
                mainText: formData.mainText as string,
                price: formData.price,
                priceAbbr: formData.priceAbbr,
                priceExplanation: formData.priceExplanation as string,
                guarantee: formData.guarantee as string,
                duration: formData.duration as string,
            }}
            onChange={onChange}
        />
    </div>
);

export default ContentView;
