import Image from "next/image";

import StyledSection from "@/shared/ui/StyledSection";
import { getDomainCity } from "@/core/domains";

import bgImage from "@images/Logo.png";
import SearchBar from "./SearchBar";
import { getServicesWithCategories } from "@/entities/service";

const ServiceSearch = async () => {
    const services = process.env.BUILD_TIME
        ? []
        : await getServicesWithCategories();
    return (
        <StyledSection
            isSecondary={true}
            sectionClassName="text-white relative bg-slate-500!"
        >
            <SearchBar services={services} />
        </StyledSection>
    );
};

export default ServiceSearch;
