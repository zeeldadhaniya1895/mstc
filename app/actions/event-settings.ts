
'use server';

import { db } from '@/lib/db';
import { events, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateEventSettings(eventId: string, formData: FormData) {
    const status = formData.get('status') as any;
    const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : null;
    const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : null;
    const posterUrl = formData.get('posterUrl') as string;

    // We don't verify Auth here for brevity, but in prod we should check admin role again.

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user || !['convener', 'deputy_convener', 'core_member', 'member'].includes(user.role || '')) {
        return { message: 'Unauthorized: You do not have permission to manage events.', success: false };
    }

    try {
        await db.update(events)
            .set({
                status,
                startDate,
                endDate,
                posterUrl
            })
            .where(eq(events.id, eventId));

        revalidatePath(`/admin/events/${eventId}`);
        revalidatePath('/admin/events');
        return { message: 'Event settings updated successfully', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to update event', success: false };
    }
}
