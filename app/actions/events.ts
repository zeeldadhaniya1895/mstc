
'use server';

import { db } from '@/lib/db';
import { events, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEvent(prevState: any, formData: FormData) {
    // Extract primitive fields
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const type = formData.get('type') as any;
    const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : null;
    const session = await auth(); // Get session

    if (!session?.user?.id) {
        return { message: 'Unauthorized: No active session.', success: false };
    }

    // Extract primitive fields and create a data object
    const data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        type: formData.get('type') as any,
        startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
        endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
        posterUrl: formData.get('posterUrl') as string,
        maxTeamSize: parseInt(formData.get('maxTeamSize') as string || '1'), // Added maxTeamSize
    };

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user || !['convener', 'deputy_convener', 'core_member'].includes(user.role || '')) {
        return { message: 'Unauthorized: You do not have permission to create events.', success: false };
    }

    try {
        await db.insert(events).values({
            title: data.title,
            slug: data.slug,
            type: data.type,
            status: 'upcoming',
            posterUrl: data.posterUrl,
            startDate: data.startDate,
            endDate: data.endDate,
            config: {
                registrationFields: [], // Default empty fields
                maxTeamSize: data.maxTeamSize || 1
            }
        });
        // If insertion is successful, return a success message
        // The original snippet had 'Failed to create event' here, which seems like a copy-paste error.
        // Assuming it should be a success message or just proceed to revalidate/redirect.
        // For consistency with the error handling, returning a success object.
        return { message: 'Event created successfully!', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to create event', success: false };
    }

    revalidatePath('/admin/events');
    redirect('/admin/events');
}
