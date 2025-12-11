
'use server';

import { db } from '@/lib/db';
import { roadmaps } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function saveRoadmap(eventId: string, domain: string, content: any[]) {
    // Check if roadmap for this domain already exists
    const existing = await db.query.roadmaps.findFirst({
        where: and(
            eq(roadmaps.eventId, eventId),
            eq(roadmaps.domain, domain)
        )
    });

    try {
        if (existing) {
            await db.update(roadmaps)
                .set({ content: content })
                .where(eq(roadmaps.id, existing.id));
        } else {
            await db.insert(roadmaps).values({
                eventId,
                domain,
                content
            });
        }

        revalidatePath(`/admin/events/${eventId}/roadmap`);
        return { success: true, message: 'Roadmap saved successfully' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Failed to save roadmap' };
    }
}

export async function deleteRoadmapDomain(roadmapId: string, eventId: string) {
    try {
        await db.delete(roadmaps).where(eq(roadmaps.id, roadmapId));
        revalidatePath(`/admin/events/${eventId}/roadmap`);
        return { success: true, message: 'Domain deleted' };
    } catch (e) {
        return { success: false, message: 'Failed to delete' };
    }
}
