"use client";

import CloseIcon from "@icons/close-black.svg";
import { AdminArticleTaxonomyPanel } from "@/widgets/admin-article-taxonomy";
import AdminRedactorForm from "../AdminMenuService";

interface AdminRedactorProps {
    onClose: () => void;
    mode: "edit" | "create" | "delete" | "articleTaxonomy";
}

const AdminAside = ({ onClose, mode }: AdminRedactorProps) => {
    return (
        <aside className="absolute right-0 z-99 m-4 w-full lg:w-1/3">
            <div className="no-scrollbar sticky top-20 max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-black bg-slate-50 inset-shadow-sm/30">
                <button onClick={onClose}>
                    <CloseIcon
                        className="absolute top-5 right-5 h-10 w-10 rounded-full"
                        alt="Закрыть"
                    />
                </button>
                {mode === "articleTaxonomy" ? (
                    <AdminArticleTaxonomyPanel />
                ) : (
                    <AdminRedactorForm mode={mode} onClose={onClose} />
                )}
            </div>
        </aside>
    );
};

export default AdminAside;
