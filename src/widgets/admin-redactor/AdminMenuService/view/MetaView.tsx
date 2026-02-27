import BackButton from "../ui/BackButton";
import MetaDataField from "../fields/MetaDataField";
import { BaseViewProps } from "@/widgets/admin-redactor/model/adminRedactor.types";

const MetaView = ({ formData, onChange, onBack }: BaseViewProps) => (
    <div>
        <BackButton onBack={onBack} />
        <MetaDataField
            formData={{
                slug: formData.slug,
                metaTitle: formData.metaTitle as string,
                metaDescription: formData.metaDescription as string,
            }}
            onChange={onChange}
        />
    </div>
);

export default MetaView;
