
'use server';

import { db } from '@/lib/db';
import { checkpoints, registrations, events } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function submitCheckpoint(eventId: string, weekNumber: number, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized', success: false };

    // 1. Get User's Registration ID for this event
    const registration = await db.query.registrations.findFirst({
        where: and(
            eq(registrations.userId, session.user.id),
            eq(registrations.eventId, eventId)
        )
    });

    if (!registration) return { message: 'You are not registered for this event.', success: false };

    try {
        // 2. Check if submission exists
        const existing = await db.query.checkpoints.findFirst({
            where: and(
                eq(checkpoints.registrationId, registration.id),
                eq(checkpoints.weekNumber, weekNumber)
            )
        });

        if (existing) {
            // Update
            await db.update(checkpoints)
                .set({ submissionContent: content, isApproved: false }) // Reset approval on new submission
                .where(eq(checkpoints.id, existing.id));
        } else {
            // Insert
            await db.insert(checkpoints).values({
                registrationId: registration.id,
                weekNumber: weekNumber,
                submissionContent: content,
                isApproved: false
            });
        }

        revalidatePath(`/dashboard/events`);
        // We'll need a specific path for the roadmap view, e.g. /dashboard/events/[slug]/roadmap

        return { message: 'Checkpoint submitted successfully!', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to submit checkpoint.', success: false };
    }
}
