
'use server';

import { db } from '@/lib/db';
import { checkpoints, events, users, registrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function approveCheckpoint(checkpointId: string, eventId: string) {
    try {
        const checkpoint = await db.query.checkpoints.findFirst({
            where: eq(checkpoints.id, checkpointId),
            with: {
                registration: {
                    with: {
                        user: true
                    }
                }
            }
        });

        // Type guard to ensure relation exists
        if (!checkpoint || !checkpoint.registration || !checkpoint.registration.user) {
            return { success: false, message: 'Checkpoint or related user not found' };
        }

        if (!checkpoint) return { success: false, message: 'Checkpoint not found' };

        // 1. Mark Approved
        await db.update(checkpoints)
            .set({ isApproved: true, mentorFeedback: 'Approved!' }) // Default feedback
            .where(eq(checkpoints.id, checkpointId));

        // 2. Award XP (Gamification - Simple +100 XP for now)
        // Ideally we fetch XP amount from Event Config
        const currentUserXP = checkpoint.registration.user.xpPoints || 0;
        await db.update(users)
            .set({ xpPoints: currentUserXP + 100 })
            .where(eq(users.id, checkpoint.registration.userId));

        revalidatePath(`/admin/events/${eventId}/checkpoints`);
        return { success: true, message: 'Checkpoint approved & XP awarded.' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Failed to approve.' };
    }
}

export async function rejectCheckpoint(checkpointId: string, feedback: string, eventId: string) {
    try {
        await db.update(checkpoints)
            .set({ isApproved: false, mentorFeedback: feedback })
            .where(eq(checkpoints.id, checkpointId));

        revalidatePath(`/admin/events/${eventId}/checkpoints`);
        return { success: true, message: 'Feedback sent to user.' };
    } catch (e) {
        return { success: false, message: 'Failed to reject.' };
    }
}
