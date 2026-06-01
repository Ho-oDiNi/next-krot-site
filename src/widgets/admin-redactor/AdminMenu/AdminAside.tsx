"use client";

import CloseIcon from "@icons/close-black.svg";
import { AdminArticleTaxonomyPanel } from "@/widgets/admin-article-taxonomy";
import ArticleDeletePanel from "./ArticleDeletePanel";

export type AdminAsideMode = "articleTaxonomy" | "deleteArticle";

interface AdminRedactorProps {
    onClose: () => void;
    mode: AdminAsideMode;
    articleSlug?: string | null;
}

const AdminAside = ({
    onClose,
    mode,
    articleSlug = null,
}: AdminRedactorProps) => {
    return (
        <aside className="fixed top-20 right-4 left-4 z-[99] lg:left-auto lg:w-1/3">
            <div className="no-scrollbar max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-black bg-slate-50 inset-shadow-sm/30 dark:border-slate-700 dark:bg-slate-950">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть панель"
                >
                    <CloseIcon
                        className="absolute top-5 right-5 h-10 w-10 rounded-full"
                        alt="Закрыть"
                    />
                </button>
                {mode === "articleTaxonomy" ? (
                    <AdminArticleTaxonomyPanel />
                ) : (
                    <ArticleDeletePanel
                        articleSlug={articleSlug}
                        onClose={onClose}
                    />
                )}
            </div>
        </aside>
    );
};

export default AdminAside;
