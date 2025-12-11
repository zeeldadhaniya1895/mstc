import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [
        GitHub({
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.role) {
                session.user.role = token.role as any;
            }
            return session;
        }
    }
} satisfies NextAuthConfig
