"use client";

import Image, { StaticImageData } from "next/image";

interface AdminButtonProps {
    icon: StaticImageData;
    callback?: () => void;
}

const AdminButton = ({ icon, callback }: AdminButtonProps) => {
    return (
        <button
            className="h-10 w-10 rounded-full bg-white hover:bg-slate-300"
            onClick={callback}
        >
            <Image src={icon} className="w-full" alt="" />
        </button>
    );
};

export default AdminButton;
