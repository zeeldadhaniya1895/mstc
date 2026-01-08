
import { db } from '@/lib/db';
import { checkpoints, events, registrations, users } from '@/db/schema';
import { eq, and, desc, or, isNull, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import CheckpointReviewQueue from '@/components/admin/checkpoint-review-queue';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function CheckpointsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ domain?: string }> }) {
    const { id } = await params;
    const { domain } = await searchParams;

    const event = await db.query.events.findFirst({
        where: eq(events.id, id)
    });

    if (!event) return notFound();

    // 1. Fetch distinct assigned domains for the filter dropdown
    const distinctDomains = await db.select({
        domain: registrations.assignedDomain
    })
        .from(registrations)
        .where(and(
            eq(registrations.eventId, id),
            sql`${registrations.assignedDomain} IS NOT NULL`
        ))
        .groupBy(registrations.assignedDomain);

    const availableDomains = distinctDomains.map(d => d.domain).filter(Boolean) as string[];

    // 2. Build Query with proper filtering
    const conditions = [
        eq(registrations.eventId, id),
        or(
            eq(checkpoints.isApproved, false),
            isNull(checkpoints.isApproved)
        )
    ];

    if (domain) {
        conditions.push(eq(registrations.assignedDomain, domain));
    }

    const rawChecks = await db.select({
        id: checkpoints.id,
        weekNumber: checkpoints.weekNumber,
        submissionContent: checkpoints.submissionContent,
        isApproved: checkpoints.isApproved,
        createdAt: checkpoints.createdAt,
        regId: registrations.id,
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        assignedDomain: registrations.assignedDomain
    })
        .from(checkpoints)
        .innerJoin(registrations, eq(checkpoints.registrationId, registrations.id))
        .innerJoin(users, eq(registrations.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(checkpoints.createdAt));

    const allChecks = rawChecks.map(check => ({
        id: check.id,
        weekNumber: check.weekNumber,
        submissionContent: check.submissionContent,
        isApproved: check.isApproved,
        createdAt: check.createdAt,
        registration: {
            id: check.regId,
            assignedDomain: check.assignedDomain,
            user: {
                id: check.userId,
                name: check.userName,
                email: check.userEmail
            }
        }
    }));

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Checkpoint Reviews</h1>
                    <p className="text-gray-400">Review work submitted for <span className="text-cyan-400">{event.title}</span>.</p>
                </div>
            </div>

            {/* Filter UI */}
            <div className="flex gap-2 pb-4 overflow-x-auto">
                <Link href={`/admin/events/${id}/checkpoints`}>
                    <Button variant={!domain ? "default" : "outline"} size="sm" className={!domain ? "bg-shatter-yellow text-black" : ""}>
                        All
                    </Button>
                </Link>
                {availableDomains.map(d => (
                    <Link key={d} href={`/admin/events/${id}/checkpoints?domain=${encodeURIComponent(d)}`}>
                        <Button variant={domain === d ? "default" : "outline"} size="sm" className={domain === d ? "bg-cyan-500 text-black" : ""}>
                            {d || "Unassigned"}
                        </Button>
                    </Link>
                ))}
            </div>

            <CheckpointReviewQueue submissions={allChecks} eventId={event.id} />
        </div>
    );
}
