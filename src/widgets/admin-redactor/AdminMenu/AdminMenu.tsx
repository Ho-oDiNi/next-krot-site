"use client";

import PlusIcon from "@icons/plus-blue.svg";
import TrashIcon from "@icons/trash-red.svg";
import AdminButton from "./AdminButton";
import { usePathname } from "next/navigation";

interface AdminMenuProps {
    onPlus: () => void;
    onDelete: () => void;
}

const AdminMenu = ({ onPlus, onDelete }: AdminMenuProps) => {
    const currentPath = usePathname();
    const isRedactorPath = currentPath === "/admin/redactor";

    return (
        <menu className="fixed right-5 bottom-5 z-99 flex flex-col gap-4 rounded-3xl p-2 shadow-2xl backdrop-blur-xl">
            {!isRedactorPath ? (
                <AdminButton callback={onPlus}>
                    <PlusIcon className="absolute-center dark:text-blue-2 00 size-8 text-blue-800" />
                </AdminButton>
            ) : (
                <AdminButton callback={onDelete}>
                    <TrashIcon className="size-full" />
                </AdminButton>
            )}
        </menu>
    );
};

export default AdminMenu;
