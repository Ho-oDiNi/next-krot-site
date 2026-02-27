import { ArrayViewProps } from "@/widgets/admin-redactor/model/adminRedactor.types";
import WhatIncludedField from "../fields/WhatIncludedField";
import BackButton from "../ui/BackButton";

const WhatIncludedView = ({
    formData,
    onBack,
    onArrayChange,
    onAddArrayItem,
    onRemoveArrayItem,
}: ArrayViewProps) => (
    <div className="space-y-4">
        <BackButton onBack={onBack} />
        <WhatIncludedField
            label="Что входит в работы"
            items={formData.whatIncluded as string[]}
            onAdd={() => onAddArrayItem("whatIncluded")}
            onChange={(index, value) =>
                onArrayChange("whatIncluded", index, value)
            }
            onRemove={(index) => onRemoveArrayItem("whatIncluded", index)}
        />
        <WhatIncludedField
            label="Используемые материалы"
            items={formData.materials as string[]}
            onAdd={() => onAddArrayItem("materials")}
            onChange={(index, value) =>
                onArrayChange("materials", index, value)
            }
            onRemove={(index) => onRemoveArrayItem("materials", index)}
            rows={3}
        />
    </div>
);

export default WhatIncludedView;
