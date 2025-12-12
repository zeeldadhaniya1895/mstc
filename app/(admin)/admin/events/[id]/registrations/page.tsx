import { db } from '@/lib/db';
import { events, registrations, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { RegistrationsClientView } from '@/components/admin/registrations-client-view';

export default async function AdminRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const event = await db.query.events.findFirst({
        where: eq(events.id, id)
    });

    if (!event) return notFound();

    const allRegistrations = await db.query.registrations.findMany({
        where: eq(registrations.eventId, id),
        with: {
            user: true,
            team: true,
            checkpoints: true // Added checkpoints for export
        },
        orderBy: [desc(registrations.createdAt)]
    });

    const domains = event.config?.availableDomains || [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Registrations: {event.title}</h1>
            </div>

            <RegistrationsClientView
                initialRegistrations={allRegistrations}
                event={event}
                availableDomains={domains}
            />
        </div>
    );
}
