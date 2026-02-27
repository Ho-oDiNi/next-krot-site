import StyledSection from "@/shared/ui/StyledSection";
import { ServiceSearch } from "@/features/service-search";
import { ServiceGrid } from "@/widgets/service-grid";

const PageServices = async () => {
    return (
        <>
            <ServiceSearch />
            <StyledSection>
                <ServiceGrid />
            </StyledSection>
        </>
    );
};

export default PageServices;
