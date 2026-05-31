import { cn } from "@/shared/lib/cn";
import { AdminArticleGrid } from "@/widgets/admin-article-grid";

const AdminPage = async () => {
    return (
        <>
            <h1
                className={cn(
                    "mb-6 text-center text-4xl font-bold text-slate-500 md:text-5xl",
                )}
            >
                Администрирование статей
            </h1>
            <AdminArticleGrid />
        </>
    );
};

export default AdminPage;
