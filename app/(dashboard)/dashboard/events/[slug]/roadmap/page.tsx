
import { db } from '@/lib/db';
import { events, roadmaps, registrations, checkpoints } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import RoadmapViewer from '@/components/roadmap/roadmap-viewer';
import { Badge } from '@/components/ui/badge';

export default async function UserRoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await auth();
    if (!session?.user?.id) return redirect('/login');

    const { slug } = await params;
    const event = await db.query.events.findFirst({
        where: eq(events.slug, slug)
    });

    if (!event) return notFound();

    // 1. Get Roadmap Content
    // For now, naive assumption: There is ONE main roadmap domain or we just pick the first one.
    // In future: Users might select their "Track" (Web/App/AIML). 
    // Fallback: Pick the first roadmap found for this event.
    const roadmap = await db.query.roadmaps.findFirst({
        where: eq(roadmaps.eventId, event.id)
    });

    if (!roadmap) {
        return (
            <div className="p-12 text-center text-gray-500">
                <h1 className="text-2xl font-bold mb-2">{event.title} Roadmap</h1>
                <p>No roadmap has been published for this event yet.</p>
            </div>
        );
    }

    // 2. Get User's Registration (to link checkpoints)
    const registration = await db.query.registrations.findFirst({
        where: and(
            eq(registrations.userId, session.user.id),
            eq(registrations.eventId, event.id)
        )
    });

    if (!registration) return redirect(`/dashboard/events/${slug}`); // Redirect to details if not registered

    // 3. Get User's Submissions (Checkpoints)
    const userCheckpoints = await db.select().from(checkpoints).where(eq(checkpoints.registrationId, registration.id));

    // Convert to Map for easier lookup: { weekNumber: CheckpointRow }
    const submissionsMap = userCheckpoints.reduce((acc, curr) => {
        acc[curr.weekNumber] = curr;
        return acc;
    }, {} as Record<number, any>);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{event.title} Roadmap</h1>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">{roadmap.domain}</Badge>
                </div>
            </div>

            <RoadmapViewer
                roadmapContent={roadmap.content as any[]}
                eventId={event.id}
                submissions={submissionsMap}
            />
        </div>
    );
}
