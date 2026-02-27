import FeatureCard from "@/shared/ui/FeatureCard";
import StyledSection from "@/shared/ui/StyledSection";
import { ABOUT_ITEMS } from "../config";

const AboutCompany = () => {
    return (
        <StyledSection
            isSecondary={true}
            sectionClassName="flex-center min-h-150"
        >
            <hgroup className="text-center md:max-w-2xl">
                <h1 className="text-h1">Наши цель</h1>
                <p className="text-main">
                    Быть ведущей цифровой платформой, формирующей новый стандарт
                    российской журналистики и дискуссии о бизнесе,
                    предпринимателях, технологиях, инновациях, ИИ и обществе.
                </p>
            </hgroup>
            <div className="grid w-full items-start gap-6 md:grid-cols-4">
                {ABOUT_ITEMS.map((item) => (
                    <FeatureCard key={item.title} {...item} />
                ))}
            </div>
        </StyledSection>
    );
};

export default AboutCompany;
