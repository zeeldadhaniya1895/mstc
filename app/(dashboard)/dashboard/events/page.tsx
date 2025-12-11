
import { db } from '@/lib/db';
import { events } from '@/db/schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { desc, eq } from 'drizzle-orm';

export default async function UserEventsList() {
    const liveEvents = await db.select().from(events).where(eq(events.status, 'live'));
    const upcomingEvents = await db.select().from(events).where(eq(events.status, 'upcoming'));

    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Live Events
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                    {liveEvents.length === 0 && <p className="text-gray-500">No live events at the moment.</p>}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-6">Upcoming Events</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                    {upcomingEvents.length === 0 && <p className="text-gray-500">No upcoming events scheduled.</p>}
                </div>
            </section>
        </div>
    );
}

function EventCard({ event }: { event: any }) {
    return (
        <Card className="flex flex-col h-full bg-[#141414] border-white/10 hover:border-cyan-500/30 transition group overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {/* Placeholder for Poster Image - eventually use Next/Image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <Calendar className="size-8 opacity-20" />
                </div>
                <Badge className="absolute top-4 right-4 bg-black/50 backdrop-blur border-white/10 capitalize">
                    {event.type.replace('_', ' ')}
                </Badge>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-2">
                    Join the {event.title} to showcase your skills and compete with the best.
                </p>

                <Link href={`/dashboard/events/${event.slug}`}>
                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                        View Details
                    </Button>
                </Link>
            </div>
        </Card>
    )
}
