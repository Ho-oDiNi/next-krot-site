import { ServiceInfo } from "@/widgets/service-info";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoryByServiceSlug, getCategories } from "@/entities/category";
import { getServiceBySlug, getServicesByCategory } from "@/entities/service";

interface ServicePageProps {
    params: Promise<{ category: string; service: string }>;
}

export const generateMetadata = async ({
    params,
}: ServicePageProps): Promise<Metadata> => {
    const { service } = await params;

    if (process.env.BUILD_TIME) {
        return {};
    }

    const serviceData = await getServiceBySlug(service);

    return {
        title: serviceData?.metaTitle,
        description: serviceData?.metaDescription,
    };
};

export default async function ServicePage({ params }: ServicePageProps) {
    const { service } = await params;

    if (process.env.BUILD_TIME) {
        return <p>Услуга недоступна на сборке</p>;
    }

    const serviceData = await getServiceBySlug(service);

    if (!serviceData) {
        notFound();
    }

    const serviceCategory = await getCategoryByServiceSlug(service);
    const categoryServices = serviceCategory
        ? await getServicesByCategory(serviceCategory.id)
        : [];

    return (
        <>
            <ServiceInfo
                service={serviceData}
                category={serviceCategory}
                categoryServices={categoryServices}
            />
        </>
    );
}

export const generateStaticParams = async () => {
    if (process.env.BUILD_TIME) return [];

    const categories = await getCategories();

    return categories.flatMap((category) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category.serviceSlugs.map((serviceSlug: any) => ({
            category: category.slug,
            service: serviceSlug,
        })),
    );
};

export const dynamic = "force-dynamic";
