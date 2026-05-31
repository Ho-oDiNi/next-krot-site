import { auth } from "@/core/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    return children;
};

export default AdminLayout;
