
import { db } from '@/lib/db';
import { events, users } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, Map, Settings } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function EventsListPage() {
    const session = await auth();
    // Only fetch if session exists
    let canCreate = false;
    if (session?.user?.id) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });
        if (user && ['convener', 'deputy_convener', 'core_member'].includes(user.role || '')) {
            canCreate = true;
        }
    }

    const allEvents = await db.query.events.findMany({
        orderBy: (events, { desc }) => [desc(events.createdAt)],
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Events Management</h1>
                    <p className="text-gray-400">Create and manage your club events.</p>
                </div>
                {canCreate && (
                    <Link href="/admin/events/create">
                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-4">
                {allEvents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-white/10">
                        No events found. Create your first event!
                    </div>
                ) : (
                    allEvents.map((event: any) => (
                        <div key={event.id} className="p-6 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center hover:bg-white/10 transition">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 capitalize">{event.type}</Badge>
                                    <Badge variant={event.status === 'live' ? 'default' : 'secondary'} className="capitalize">{event.status}</Badge>
                                </div>
                                <div className="text-sm text-gray-400 font-mono">/{event.slug}</div>
                            </div>
                            <Link href={`/admin/events/${event.id}`}>
                                <Button variant="ghost">Manage</Button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
