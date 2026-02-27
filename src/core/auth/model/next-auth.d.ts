import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { Role } from "@prisma/client";

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role?: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id?: string;
            role?: Role;
        };
    }
    interface User {
        role?: Role;
    }
}
