'use server';

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(data: {
    image?: string;
    bio?: string;
    githubId?: string;
    linkedinId?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        await db.update(users)
            .set({
                ...(data.image && { image: data.image }), // Only update if provided
                bio: data.bio, // Allow clearing (empty string)
                githubId: data.githubId,
                linkedinId: data.linkedinId
            })
            .where(eq(users.id, session.user.id));

        revalidatePath('/team');
        revalidatePath('/dashboard/profile');
        return { message: 'Profile updated successfully!', success: true };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { message: 'Failed to update profile', success: false };
    }
}
