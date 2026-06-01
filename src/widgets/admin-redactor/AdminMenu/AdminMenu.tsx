"use client";

import PlusIcon from "@icons/plus-blue.svg";
import TrashIcon from "@icons/trash-red.svg";
import AdminButton from "./AdminButton";
import { usePathname } from "next/navigation";

interface AdminMenuProps {
    onPlus: () => void;
    onDelete: () => void;
    onSettings: () => void;
}

const AdminMenu = ({ onPlus, onDelete, onSettings }: AdminMenuProps) => {
    const currentPath = usePathname();
    const isRedactorPath = currentPath === "/admin/redactor";

    return (
        <menu className="fixed right-5 bottom-5 z-99 flex flex-col gap-4 rounded-3xl p-2 shadow-2xl backdrop-blur-xl">
            <AdminButton
                callback={onSettings}
                ariaLabel="Редактировать авторов и темы статей"
            >
                <span className="block text-3xl leading-none text-slate-700 dark:text-slate-100">
                    ⚙
                </span>
            </AdminButton>

            {!isRedactorPath ? (
                <AdminButton callback={onPlus} ariaLabel="Добавить услугу">
                    <PlusIcon className="absolute-center dark:text-blue-2 00 size-8 text-blue-800" />
                </AdminButton>
            ) : (
                <AdminButton callback={onDelete} ariaLabel="Удалить услугу">
                    <TrashIcon className="size-full" />
                </AdminButton>
            )}
        </menu>
    );
};

export default AdminMenu;
