"use client";

import PlusIcon from "@icons/plus-blue.svg";
import TrashIcon from "@icons/trash-red.svg";
import AdminButton from "./AdminButton";

interface AdminMenuProps {
    canDeleteArticle: boolean;
    onDeleteArticle: () => void;
    onSettings: () => void;
}

const AdminMenu = ({
    canDeleteArticle,
    onDeleteArticle,
    onSettings,
}: AdminMenuProps) => {
    return (
        <menu className="fixed right-5 bottom-5 z-99 flex flex-col gap-4 rounded-3xl p-2 shadow-2xl backdrop-blur-xl">
            <AdminButton
                callback={onSettings}
                ariaLabel="Создать, изменить или удалить темы и авторов статей"
            >
                <span className="block text-3xl leading-none text-slate-700 dark:text-slate-100">
                    ⚙
                </span>
            </AdminButton>

            <AdminButton
                href="/admin/redactor/article"
                ariaLabel="Создать новую статью"
            >
                <PlusIcon className="absolute-center size-8 text-blue-800 dark:text-blue-200" />
            </AdminButton>

            <AdminButton
                callback={onDeleteArticle}
                disabled={!canDeleteArticle}
                ariaLabel={
                    canDeleteArticle
                        ? "Удалить текущую статью"
                        : "Откройте статью для удаления"
                }
            >
                <TrashIcon className="size-full" />
            </AdminButton>
        </menu>
    );
};

export default AdminMenu;
