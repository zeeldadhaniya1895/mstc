
import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db) as any,
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            } else if (token.id) {
                // Force fetch fresh role for existing sessions
                // This runs in Node runtime (safe for DB)
                try {
                    const freshUser = await db.query.users.findFirst({
                        where: eq(users.id, token.id as string),
                        columns: { role: true }
                    });
                    if (freshUser) {
                        token.role = freshUser.role;
                    }
                } catch (error) {
                    console.error("Error refreshing role:", error);
                }
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
