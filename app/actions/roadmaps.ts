'use server';

import { db } from '@/lib/db';
import { roadmaps, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function fetchLiveRoadmaps() {
    try {
        const data = await db.query.roadmaps.findMany({
            with: {
                event: true
            }
        });
        return data;
    } catch (error) {
        console.error('Failed to fetch live roadmaps:', error);
        return [];
    }
}

export async function saveRoadmap(eventId: string, domain: string, content: any[]) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Unauthorized', success: false };
    }

    // Verify Admin Access
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    if (!user || !['convener', 'deputy_convener', 'core_member', 'member'].includes(user.role || '')) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        const existing = await db.query.roadmaps.findFirst({
            where: and(
                eq(roadmaps.eventId, eventId),
                eq(roadmaps.domain, domain)
            )
        });

        if (existing) {
            await db.update(roadmaps)
                .set({ content, createdAt: new Date() }) // Update content
                .where(eq(roadmaps.id, existing.id));
        } else {
            await db.insert(roadmaps).values({
                eventId,
                domain,
                content
            });
        }

        revalidatePath(`/admin/events/${eventId}/roadmap`);
        return { message: 'Roadmap saved successfully', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to save roadmap', success: false };
    }
}

export async function deleteRoadmapDomain(roadmapId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized', success: false };

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    if (!user || !['convener', 'deputy_convener', 'core_member'].includes(user.role || '')) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        await db.delete(roadmaps).where(eq(roadmaps.id, roadmapId));
        return { message: 'Roadmap deleted', success: true };
    } catch (e) {
        return { message: 'Failed to delete', success: false };
    }
}
