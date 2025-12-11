
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db) as any,
    session: { strategy: "jwt" },
    providers: [
        GitHub,
        Google,
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                session.user.role = token.role as any;
            }
            return session;
        }
    }
})
