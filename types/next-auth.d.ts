
import { type DefaultSession } from "next-auth"

export type Role = "student" | "member" | "core_member" | "deputy_convener" | "convener"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: Role
        } & DefaultSession["user"]
    }

    interface User {
        role: Role
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: Role
    }
}
