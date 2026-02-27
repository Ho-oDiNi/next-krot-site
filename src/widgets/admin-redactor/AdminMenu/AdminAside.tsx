"use client";

import closeIcon from "@icons/close-blue-dark.svg";
import Image from "next/image";
import AdminRedactorForm from "../AdminMenuService";

interface AdminRedactorProps {
    onClose: () => void;
    mode: "edit" | "create" | "delete";
}

const AdminAside = ({ onClose, mode }: AdminRedactorProps) => {
    return (
        <aside className="absolute right-0 z-99 m-4 w-full lg:w-1/3">
            <div className="no-scrollbar sticky top-20 max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-black bg-slate-50 inset-shadow-sm/30">
                <button onClick={onClose}>
                    <Image
                        src={closeIcon}
                        className="absolute top-5 right-5 h-10 w-10 rounded-full"
                        alt="Закрыть"
                    />
                </button>
                <AdminRedactorForm mode={mode} onClose={onClose} />
            </div>
        </aside>
    );
};

export default AdminAside;
