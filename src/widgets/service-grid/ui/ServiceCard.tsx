import { StyledLink } from "@/shared/ui/StyledLink";

interface ServiceCardProps {
    title: string;
    description: string;
    link: string;
    price: number;
    priceAbbr: string;
    priceExplanation?: string;
}

const ServiceCard = ({ title, description, link }: ServiceCardProps) => {
    return (
        <article className="flex flex-col justify-between gap-6 rounded-3xl bg-slate-200 p-8">
            <hgroup className="text-start md:max-w-2xl">
                <h3 className="text-h3 mb-6">{title}</h3>
                <p className="text-content">{description}</p>
            </hgroup>

            <div className="flex flex-col justify-end gap-3 lg:flex-row">
                <StyledLink
                    href={link}
                    variant="secondary"
                    size="sm"
                    className="w-full lg:w-auto"
                >
                    Подробнее
                </StyledLink>
            </div>
        </article>
    );
};

export default ServiceCard;
