import { getCategoriesWithServices } from "@/entities/category";
import CategoryCard from "./CategoryCard";
import LeadCard from "./LeadCard";
import { Fragment } from "react/jsx-runtime";

const CategoryGrid = async () => {
    const categories = await getCategoriesWithServices();

    return (
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
                <Fragment key={category.id}>
                    {index === 2 && <LeadCard />}
                    <CategoryCard category={category} />
                </Fragment>
            ))}
        </div>
    );
};

export default CategoryGrid;
