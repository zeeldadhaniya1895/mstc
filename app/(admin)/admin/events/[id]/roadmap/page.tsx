
import { db } from '@/lib/db';
import { roadmaps, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import RoadmapBuilder from '@/components/admin/roadmap-builder';
import { notFound } from 'next/navigation';

export default async function RoadmapPage({ params }: { params: { id: string } }) {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;

    const event = await db.query.events.findFirst({
        where: eq(events.id, id)
    });

    if (!event) return notFound();

    // Fetch existing roadmaps for this event
    const existingRoadmaps = await db.select().from(roadmaps).where(eq(roadmaps.eventId, id));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Roadmap Builder</h1>
                <p className="text-gray-400">Design the curriculum for <span className="text-cyan-400">{event.title}</span>.</p>
            </div>

            <RoadmapBuilder eventId={event.id} initialRoadmaps={existingRoadmaps} />
        </div>
    );
}
