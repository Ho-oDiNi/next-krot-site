import { Service } from "@/entities/service";

import { ParsedHTML } from "@/shared/lib/html-react-parser";
import { StyledSpan } from "@/shared/ui/StyledSpan";
import ServiceHeader from "./ServiceHeader";

interface ServiceContentProps {
    service: Service;
}

export default function ServiceContent({ service }: ServiceContentProps) {
    return (
        <div className="grid gap-8 md:gap-14">
            <section className="flex flex-col gap-8 md:gap-15">
                <ServiceHeader
                    title={service.contentTitle ?? service.title}
                    description={service.contentDescription}
                />

                <div className="service__main-content flex flex-col gap-4">
                    <ParsedHTML html={service.mainText} />
                </div>
                <div className="flex-start flex-wrap gap-4">
                    {service.guarantee && (
                        <StyledSpan size="sm" variant="secondary">
                            {service.guarantee}
                        </StyledSpan>
                    )}
                    {service.duration && (
                        <StyledSpan size="sm" variant="secondary">
                            {service.duration}
                        </StyledSpan>
                    )}
                </div>
            </section>
        </div>
    );
}
