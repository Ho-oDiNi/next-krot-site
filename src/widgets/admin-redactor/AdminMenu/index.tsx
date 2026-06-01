"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import AdminAside, { type AdminAsideMode } from "./AdminAside";
import AdminMenu from "./AdminMenu";

const ARTICLE_EDIT_PATH_PATTERN = /^\/admin\/redactor\/article\/([^/]+)$/;

const getEditedArticleSlug = (pathname: string | null) => {
    const matchedPath = pathname?.match(ARTICLE_EDIT_PATH_PATTERN);

    return matchedPath?.[1] ? decodeURIComponent(matchedPath[1]) : null;
};

const AdminRedactor = () => {
    const [redactorMode, setRedactorMode] = useState<AdminAsideMode | null>(
        null,
    );

    const pathname = usePathname();

    const isAdminPath = pathname?.startsWith("/admin");

    const editedArticleSlug = useMemo(
        () => getEditedArticleSlug(pathname),
        [pathname],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRedactorMode(null);
    }, [pathname]);

    const handleOpenArticleDelete = () => {
        setRedactorMode("deleteArticle");
    };

    const handleOpenArticleTaxonomy = () => {
        setRedactorMode("articleTaxonomy");
    };

    const handleClose = () => {
        setRedactorMode(null);
    };

    if (!isAdminPath) {
        return null;
    }

    return (
        <>
            {redactorMode ? (
                <AdminAside
                    mode={redactorMode}
                    articleSlug={editedArticleSlug}
                    onClose={handleClose}
                />
            ) : (
                <AdminMenu
                    canDeleteArticle={Boolean(editedArticleSlug)}
                    onDeleteArticle={handleOpenArticleDelete}
                    onSettings={handleOpenArticleTaxonomy}
                />
            )}
        </>
    );
};

export default AdminRedactor;
