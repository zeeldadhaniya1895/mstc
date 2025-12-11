
'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Helper to check if current user is Convener
async function isConvener() {
    const session = await auth();
    if (!session?.user?.id) return false;

    // Check DB for latest role, don't trust session alone for high stakes
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { role: true }
    });

    return user?.role === 'convener';
}

export async function updateUserRole(targetUserId: string, newRole: 'student' | 'member' | 'core_member' | 'deputy_convener' | 'convener') {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, message: "Unauthorized" };

        const actor = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!actor) return { success: false, message: "User not found" };

        // 1. Permission Check
        // Only Convener can promote to Core/Deputy/Convener
        // Deputy might be able to promote to Member? Let's keep it strict: Only Convener for now.
        if (actor.role !== 'convener') {
            // Exception: Maybe Deputy can verify students -> members?
            // For now, strict: Only Convener.
            return { success: false, message: "Only the Convener can manage roles." };
        }

        // 2. Self-Check (Prevent accidental self-demotion if they are the ONLY convener)
        if (targetUserId === actor.id && newRole !== 'convener') {
            // Check if there are other conveners
            const otherConveners = await db.query.users.findMany({
                where: eq(users.role, 'convener')
            });
            if (otherConveners.length <= 1) {
                return { success: false, message: "You cannot demote yourself. Transfer power to someone else first." };
            }
        }

        // 3. Update
        await db.update(users)
            .set({ role: newRole })
            .where(eq(users.id, targetUserId));

        revalidatePath('/admin/users');
        revalidatePath('/team'); // Public page update

        return { success: true, message: `User role updated to ${newRole}` };

    } catch (error) {
        console.error("Role update failed:", error);
        return { success: false, message: "Failed to update role" };
    }
}

export async function removeUser(targetUserId: string) {
    try {
        if (!await isConvener()) {
            return { success: false, message: "Only the Convener can remove users." };
        }

        // Prevent deleting self!
        const session = await auth();
        if (session?.user?.id === targetUserId) {
            return { success: false, message: "You cannot delete your own account here." };
        }

        await db.delete(users).where(eq(users.id, targetUserId));

        revalidatePath('/admin/users');
        return { success: true, message: "User removed from platform." };
    } catch (error) {
        console.error("User removal failed:", error);
        return { success: false, message: "Failed to remove user" };
    }
}
