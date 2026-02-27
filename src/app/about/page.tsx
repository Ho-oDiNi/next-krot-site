import { Metadata } from "next";

import { AboutCompany } from "@/widgets/about-company";

export const metadata: Metadata = {
    title: `О блоге КРОТ`,
    description: `Быть ведущей цифровой платформой, формирующей новый стандарт российской журналистики и дискуссии о бизнесе, предпринимателях, технологиях, инновациях, ИИ и обществе.`,
};

const About = async () => {
    return (
        <>
            <AboutCompany />
        </>
    );
};
export default About;
