import { cn } from "@/shared/lib/cn";
import { ArticleGrid } from "@/widgets/article-grid";

const HomePage = async () => {
    return (
        <>
            <h1
                className={cn(
                    "mb-6 text-center text-4xl font-bold text-slate-500 md:text-5xl",
                )}
            >
                Последние новости
            </h1>
            <ArticleGrid />
        </>
    );
};

export default HomePage;
