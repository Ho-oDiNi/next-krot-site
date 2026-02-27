import ServiceSwitchLinkWrapper from "./ServiceSwitchLinkWrapper";
import { cn } from "@/shared/lib/cn";
import { Category } from "@/entities/category";
import { Service } from "@/entities/service";

interface ServiceSwitchNavProps {
    category: Category;
    services: Service[];
    currentServiceSlug: string;
}

const ServiceSwitchNav = ({
    category,
    services,
    currentServiceSlug,
}: ServiceSwitchNavProps) => {
    if (services.length <= 1) return null;

    const gridColsByCount: Record<number, string> = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
        5: "md:grid-cols-5",
    };

    return (
        <nav
            className={cn(
                "mb-8 grid gap-2 md:m-0 md:gap-4",
                gridColsByCount[services.length],
            )}
        >
            {services.map((service, index) => (
                <ServiceSwitchLinkWrapper
                    key={service.slug}
                    href={`/services/${category.slug}/${service.slug}`}
                    isFirst={index === 0}
                    isLast={index === services.length - 1}
                    isActive={currentServiceSlug === service.slug}
                >
                    {service.title}
                </ServiceSwitchLinkWrapper>
            ))}
        </nav>
    );
};

export default ServiceSwitchNav;
