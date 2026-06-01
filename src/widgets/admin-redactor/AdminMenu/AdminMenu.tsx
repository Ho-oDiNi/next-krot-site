"use client";

import PlusIcon from "@icons/plus-circle.svg";
import TrashIcon from "@icons/trash-red.svg";
import GearIcon from "@icons/gear.svg";

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
                href="/admin/redactor/article"
                ariaLabel="Создать новую статью"
            >
                <PlusIcon className="size-6 shrink-0 text-blue-800 dark:text-blue-200" />
            </AdminButton>

            <AdminButton
                onClick={onSettings}
                ariaLabel="Создать, изменить или удалить темы и авторов статей"
            >
                <GearIcon className="size-6 shrink-0 text-slate-700 dark:text-slate-100" />
            </AdminButton>

            <AdminButton
                onClick={onDeleteArticle}
                disabled={!canDeleteArticle}
                ariaLabel={
                    canDeleteArticle
                        ? "Удалить текущую статью"
                        : "Откройте статью для удаления"
                }
            >
                <TrashIcon className="size-6 shrink-0 text-red-500" />
            </AdminButton>
        </menu>
    );
};

export default AdminMenu;
