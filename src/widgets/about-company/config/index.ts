import { FeatureCardProps } from "@/shared/ui/FeatureCard/featureCardProps.types";
import checkmarkIcon from "@icons/checkmark-red-fill.svg";
import deliveryIcon from "@icons/delivery-red-fill.svg";
import qualityIcon from "@icons/quality-red-fill.svg";
import warningIcon from "@icons/warning-red-fill.svg";

export const ABOUT_ITEMS: FeatureCardProps[] = [
    {
        icon: deliveryIcon,
        title: "Достоверность информации",
    },
    {
        icon: qualityIcon,
        title: "Технологичность",
    },
    {
        icon: checkmarkIcon,
        title: "Прозрачность",
    },
    {
        icon: warningIcon,
        title: "Инклюзивность",
    },
];
