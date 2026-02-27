"use client";

import pencilIcon from "@icons/pencil-blue-dark.svg";
import plusIcon from "@icons/plus-blue-dark.svg";
import trashIcon from "@icons/trash-red-fill.svg";
import AdminButton from "./AdminButton";
import { usePathname } from "next/navigation";

interface AdminMenuProps {
    onPencil: () => void;
    onPlus: () => void;
    onDelete: () => void;
}

const AdminMenu = ({ onPencil, onPlus, onDelete }: AdminMenuProps) => {
    const currentPath = usePathname();
    const isServicesRoot = currentPath === "/services";

    return (
        <menu className="fixed right-5 bottom-5 z-99 flex flex-col gap-4 rounded-3xl p-2 shadow-2xl backdrop-blur-xl">
            <AdminButton icon={plusIcon} callback={onPlus} />
            {!isServicesRoot && (
                <>
                    <AdminButton icon={pencilIcon} callback={onPencil} />
                    <AdminButton icon={trashIcon} callback={onDelete} />
                </>
            )}
        </menu>
    );
};

export default AdminMenu;
