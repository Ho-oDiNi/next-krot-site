import { getServicesWithCategories } from "@/entities/service";
import ServiceCard from "./ServiceCard";

interface ServiceGridProps {
    limit?: number;
}

const ServiceGrid = async ({ limit }: ServiceGridProps) => {
    const servicesWithCategories = await getServicesWithCategories(limit);

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesWithCategories.map(({ service, category }) => {
                return (
                    <ServiceCard
                        key={service.slug}
                        title={service.title}
                        description={service.description}
                        link={`/services/${category.slug}/${service.slug}`}
                    />
                );
            })}
        </div>
    );
};

export default ServiceGrid;
