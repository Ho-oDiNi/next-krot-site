import { FeatureCardProps } from "@/shared/ui/FeatureCard/featureCardProps.types";
import Image from "next/image";

const FeatureCard = ({
    icon,
    title,
    description,
    commitmentArray = [],
}: FeatureCardProps) => (
    <article className="flex flex-col rounded-3xl bg-white">
        <div className="flex-center flex-col gap-2 rounded-3xl bg-blue-900 p-6 text-center text-white">
            <Image src={icon} alt="" />
            <hgroup className="text-center md:max-w-2xl">
                <h3 className="text-h3 mb-2">{title}</h3>
                <p className="text-h3__desc">{description}</p>
            </hgroup>
        </div>

        {commitmentArray.length > 0 && (
            <ul className="p-6">
                {commitmentArray.map((commitment) => (
                    <li
                        key={commitment}
                        className="flex-start relative mt-2 ml-3 text-sm before:absolute before:top-0 before:-left-3 before:content-['•']"
                    >
                        {commitment}
                    </li>
                ))}
            </ul>
        )}
    </article>
);

export default FeatureCard;
