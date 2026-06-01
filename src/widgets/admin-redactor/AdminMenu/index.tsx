"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import AdminAside from "./AdminAside";
import AdminMenu from "./AdminMenu";

const AdminRedactor = () => {
    const [redactorMode, setRedactorMode] = useState<
        "edit" | "create" | "delete" | "articleTaxonomy" | null
    >(null);
    const pathname = usePathname();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRedactorMode(null);
    }, [pathname]);

    const handleOpenCreate = () => {
        setRedactorMode("create");
    };

    const handleOpenDelete = () => {
        setRedactorMode("delete");
    };

    const handleOpenArticleTaxonomy = () => {
        setRedactorMode("articleTaxonomy");
    };

    const handleClose = () => {
        setRedactorMode(null);
    };

    return (
        <>
            {redactorMode ? (
                <AdminAside mode={redactorMode} onClose={handleClose} />
            ) : (
                <AdminMenu
                    onPlus={handleOpenCreate}
                    onDelete={handleOpenDelete}
                    onSettings={handleOpenArticleTaxonomy}
                />
            )}
        </>
    );
};

export default AdminRedactor;
