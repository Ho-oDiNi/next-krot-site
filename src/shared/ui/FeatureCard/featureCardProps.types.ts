import { StaticImageData } from "next/image";

export interface FeatureCardProps {
    icon: string | StaticImageData;
    title: string;
    description?: string;
    commitmentArray?: string[];
}
