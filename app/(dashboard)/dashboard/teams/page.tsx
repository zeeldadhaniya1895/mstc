
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { registrations, teams, events, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Hash, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
    const session = await auth();
    if (!session?.user?.id) return redirect('/login');

    // Fetch user's registrations and associated teams
    const userRegistrations = await db.select({
        reg: registrations,
        team: teams,
        event: events,
    })
        .from(registrations)
        .leftJoin(teams, eq(registrations.teamId, teams.id))
        .leftJoin(events, eq(registrations.eventId, events.id))
        .where(eq(registrations.userId, session.user.id))
        .orderBy(desc(registrations.createdAt));

    // For each team, fetch ALL members (to show teammates)
    // This optimization could be better (e.g. single query with aggregation), but simple for now.
    // actually, let's just show the count or "View Details" to avoid N+1 query complexity here.

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">My Teams</h1>
                <p className="text-gray-400">Manage your squads for upcoming events.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userRegistrations.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/10">
                        <Users className="size-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">You haven't joined any teams yet.</p>
                        <Link href="/dashboard/events">
                            <Button variant="link" className="text-cyan-400 mt-2">Browse Events</Button>
                        </Link>
                    </div>
                ) : (
                    userRegistrations.map(({ reg, team, event }) => {
                        if (!team || !event) return null; // Should not happen given constraints

                        return (
                            <Card key={team.id} className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 mb-2">
                                            {event.title}
                                        </Badge>
                                        <Badge className={event.status === 'live' ? 'bg-green-600' : 'bg-gray-600'}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors">
                                        {team.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400 bg-black/20 p-2 rounded-md">
                                        <Hash className="size-4" />
                                        <span className="font-mono text-sm tracking-wider">{team.joinCode}</span>
                                        <span className="text-xs text-gray-500 ml-auto">(Join Code)</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Calendar className="size-4" />
                                        <span>Registered on {new Date(reg.createdAt!).toLocaleDateString()}</span>
                                    </div>

                                    {/* Future: Link to a Team Detail page with Chat/files */}
                                    <Button className="w-full mt-2" variant="secondary" disabled>
                                        Team Workspace (Coming Soon)
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
