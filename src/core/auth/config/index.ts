import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";

import prisma from "@/shared/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    trustHost: true,

    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],

    callbacks: {
        async session({ session, user }) {
            if (!session.user) return session;

            session.user.id = user.id;
            session.user.role = user.role ?? undefined;

            return session;
        },
    },
});
