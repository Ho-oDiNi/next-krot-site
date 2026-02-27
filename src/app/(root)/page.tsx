import Image from "next/image";
import notFoundImage from "@images/404.gif";

import StyledSection from "@/shared/ui/StyledSection";

const HomePage = async () => {
    return (
        <StyledSection
            isSecondary={true}
            sectionClassName="w-full flex-center min-h-150"
        >
            <div className="flex-between flex-col-reverse gap-30 md:flex-row">
                <div className="flex flex-col gap-8 md:gap-12">
                    <hgroup>
                        <h1 className="text-h1">Совсем скоро...</h1>
                        <p className="text-main">
                            Ведутся подготовительные работы.
                        </p>
                        <p className="text-main">
                            Здесь будет что-то интересное!
                        </p>
                    </hgroup>
                </div>
                <Image
                    src={notFoundImage}
                    alt="Ошибка 404"
                    className="h-auto w-100 rounded-lg border"
                />
            </div>
        </StyledSection>
    );
};

export default HomePage;
