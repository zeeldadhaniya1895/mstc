
import { db } from '@/lib/db';
import { checkpoints, events, registrations, users } from '@/db/schema';
import { eq, and, desc, or, isNull } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import CheckpointReviewQueue from '@/components/admin/checkpoint-review-queue';

export default async function CheckpointsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const event = await db.query.events.findFirst({
        where: eq(events.id, id)
    });

    if (!event) return notFound();

    // Re-do with Select Builder for correct Join filtering
    // Re-do with Select Builder for correct Join filtering
    const rawChecks = await db.select({
        id: checkpoints.id,
        weekNumber: checkpoints.weekNumber,
        submissionContent: checkpoints.submissionContent,
        isApproved: checkpoints.isApproved,
        createdAt: checkpoints.createdAt,
        regId: registrations.id,
        userId: users.id,
        userName: users.name,
        userEmail: users.email
    })
        .from(checkpoints)
        .innerJoin(registrations, eq(checkpoints.registrationId, registrations.id))
        .innerJoin(users, eq(registrations.userId, users.id))
        .where(and(
            eq(registrations.eventId, id),
            or(
                eq(checkpoints.isApproved, false),
                isNull(checkpoints.isApproved)
            )
        ))
        .orderBy(desc(checkpoints.createdAt));

    const allChecks = rawChecks.map(check => ({
        id: check.id,
        weekNumber: check.weekNumber,
        submissionContent: check.submissionContent,
        isApproved: check.isApproved,
        createdAt: check.createdAt,
        registration: {
            id: check.regId,
            user: {
                id: check.userId,
                name: check.userName,
                email: check.userEmail
            }
        }
    }));

    // Filter for actual "Pending Status" (assuming null or explicit false means needs attention)
    // Actually, usually:
    // Null = Pending
    // False = Rejected (User needs to specific fix)
    // True = Approved
    // Let's show all Non-True checks.

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Checkpoint Reviews</h1>
                <p className="text-gray-400">Review work submitted for <span className="text-cyan-400">{event.title}</span>.</p>
            </div>

            <CheckpointReviewQueue submissions={allChecks} eventId={event.id} />
        </div>
    );
}
