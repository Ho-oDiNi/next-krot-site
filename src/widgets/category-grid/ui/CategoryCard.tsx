import { StyledLink } from "@/shared/ui/StyledLink";
import Image from "next/image";
import { CategoryWithServices } from "@/entities/category";
import defaultImg from "@images/Logo.png";

interface CategoryCardProps {
    category: CategoryWithServices;
}

const CategoryCard = async ({ category }: CategoryCardProps) => {
    const services = category.services;
    return (
        <article className="overflow-hidden rounded-3xl bg-slate-200">
            <Image
                src={category.imageUrl ?? defaultImg}
                alt={category.name}
                height={200}
                width={404}
                className="h-50 w-full object-cover"
            />

            <div className="p-8">
                <h3 className="text-h3 mb-6">{category.name}</h3>
                <div className="flex-between flex-col gap-2">
                    {services.map((service) => (
                        <StyledLink
                            key={service.id}
                            href={`/services/${category.slug}/${service.slug}`}
                            variant="white"
                            size="sm"
                            className="w-full"
                        >
                            {service.title}
                        </StyledLink>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default CategoryCard;
