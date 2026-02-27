"use client";

import { PropsWithChildren } from "react";
import { useIsAdmin } from "../lib/useIsAdmin";

const AdminGate = ({ children }: PropsWithChildren) => {
    const isAdmin = useIsAdmin();

    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
};

export default AdminGate;
