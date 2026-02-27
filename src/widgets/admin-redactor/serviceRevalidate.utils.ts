import { revalidatePath } from "next/cache";

export const revalidateServicePaths = async (
    services: Array<{ categorySlug?: string | null; slug: string }>,
) => {
    const paths = new Set<string>(["/services"]);

    for (const { categorySlug, slug } of services) {
        if (categorySlug) {
            paths.add(`/services/${categorySlug}/${slug}`);
        }
    }

    await Promise.all(Array.from(paths).map((path) => revalidatePath(path)));
};
