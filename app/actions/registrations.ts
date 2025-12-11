
'use server';

import { db } from '@/lib/db';
import { registrations, teams, events } from '@/db/schema'; // Added events
import { eq, and } from 'drizzle-orm'; // Added eq, and
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';

export async function registerForEvent(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'You must be logged in to register.' };
    }

    const eventId = formData.get('eventId') as string;
    const teamMode = formData.get('teamMode') as 'create' | 'join';
    const rawData = Object.fromEntries(formData.entries());

    // 1. Check if Event Exists & Get Config (for maxTeamSize)
    const event = await db.query.events.findFirst({
        where: eq(events.id, eventId),
        columns: { config: true }
    });

    if (!event) return { message: 'Event not found.' };

    const maxTeamSize = event.config?.maxTeamSize || 4; // Default to 4 if not set

    // 2. Check if User is ALREADY registered
    const existingReg = await db.query.registrations.findFirst({
        where: and(
            eq(registrations.userId, session.user.id),
            eq(registrations.eventId, eventId)
        )
    });

    if (existingReg) {
        return { message: 'You are already registered for this event.' };
    }

    let teamId: string;
    let finalMessage = 'Success! You are registered.';

    try {
        if (teamMode === 'join') {
            // --- JOIN EXISTING TEAM ---
            const joinCode = (formData.get('joinCode') as string)?.trim().toUpperCase();
            if (!joinCode) return { message: 'Please enter a valid join code.' };

            const team = await db.query.teams.findFirst({
                where: and(
                    eq(teams.joinCode, joinCode),
                    eq(teams.eventId, eventId) // Ensure code belongs to THIS event
                )
            });

            if (!team) return { message: 'Invalid Join Code. Team not found.' };

            // Check Size Limit
            const members = await db.select().from(registrations).where(eq(registrations.teamId, team.id));
            if (members.length >= maxTeamSize) {
                return { message: `Team is full! Max size is ${maxTeamSize}.` };
            }

            teamId = team.id;
            finalMessage = `Joined team "${team.name}" successfully!`;

        } else {
            // --- CREATE NEW TEAM ---
            const teamName = formData.get('teamName') as string || `${session.user.name}'s Team`;
            const teamCode = nanoid(6).toUpperCase();

            // Insert Team
            const [newTeam] = await db.insert(teams).values({
                name: teamName,
                joinCode: teamCode,
                eventId: eventId,
                createdBy: session.user.id,
            }).returning();

            teamId = newTeam.id;
            finalMessage = `Team created! Your Join Code is: ${teamCode}`;
        }

        // 3. Create Registration linked to Team
        // Cleanup raw data
        const submissionData = { ...rawData };
        delete submissionData.eventId;
        delete submissionData.teamMode;
        delete submissionData.teamName;
        delete submissionData.joinCode;
        delete submissionData.$ACTION_REF_1;

        await db.insert(registrations).values({
            userId: session.user.id,
            eventId: eventId,
            teamId: teamId,
            customAnswers: submissionData,
            status: 'pending',
        });

    } catch (e) {
        console.error('Registration error:', e);
        return { message: 'Failed to process registration. Please try again.' };
    }

    revalidatePath(`/dashboard/events`);
    return { message: finalMessage, success: true };
}
