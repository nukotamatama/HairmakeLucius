import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const config: NextAuthConfig = {
    providers: [
        Credentials({
            name: "Password",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const password = credentials?.password as string | undefined;
                const adminPassword = process.env.ADMIN_PASSWORD;

                // Simple check
                if (password && password === adminPassword) {
                    return { id: "admin", name: "Administrator", email: "admin@hairmake-lucius.com" };
                }
                return null;
            }
        })
    ],
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
    },
    pages: {
        signIn: "/admin/login",
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
