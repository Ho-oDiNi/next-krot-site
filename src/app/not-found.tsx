import Image from "next/image";
import notFoundImage from "@images/404.gif";
import StyledSection from "@/shared/ui/StyledSection";
import { StyledLink } from "../shared/ui/StyledLink";

export default function Custom404() {
    return (
        <StyledSection isSecondary={true} sectionClassName="min-h-150">
            <div className="flex-center flex-col-reverse gap-6 md:flex-row">
                <div className="flex flex-col gap-8 md:gap-12">
                    <hgroup>
                        <h1 className="text-h1">Страница не найдена</h1>
                        <p className="text-main">Но есть много других</p>
                    </hgroup>
                    <StyledLink href="/" variant="primary" size="lg">
                        На главную
                    </StyledLink>
                </div>
                <Image
                    src={notFoundImage}
                    alt="Ошибка 404"
                    className="h-auto w-100"
                />
            </div>
        </StyledSection>
    );
}
