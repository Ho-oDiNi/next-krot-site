import { FaqViewProps } from "@/widgets/admin-redactor/model/adminRedactor.types";
import FaqItemsField from "../fields/FaqItemsField";
import BackButton from "../ui/BackButton";

const FaqView = ({
    formData,
    onBack,
    onFaqChange,
    onAddFaqItem,
    onRemoveFaqItem,
}: FaqViewProps) => (
    <div>
        <BackButton onBack={onBack} />
        <FaqItemsField
            items={formData.faqItems}
            onAdd={onAddFaqItem}
            onChange={onFaqChange}
            onRemove={onRemoveFaqItem}
        />
    </div>
);

export default FaqView;
