import { AdminGate, auth } from "@/core/auth";
import AdminRedactor from "@/widgets/admin-redactor/AdminMenu";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const ServiceLayout = async ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <div className="flex">
                <div className="min-h-150 w-full">{children}</div>
                <AdminGate>
                    <AdminRedactor />
                </AdminGate>
            </div>
        </SessionProvider>
    );
};

export default ServiceLayout;
