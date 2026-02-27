import ServiceContent from "./ServiceContent";
import { Category } from "@/entities/category";
import { Service } from "@/entities/service";

interface ServiceSectionProps {
    service: Service;
    category?: Category;
    categoryServices?: Service[];
}

const ServiceInfo = ({ service }: ServiceSectionProps) => {
    return (
        <div className="container mx-auto min-h-150 px-(--space-inside-x) py-6">
            <article className="service h-full rounded-2xl bg-slate-200 p-8">
                <ServiceContent service={service} />
            </article>
        </div>
    );
};

export default ServiceInfo;
