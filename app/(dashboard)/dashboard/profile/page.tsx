import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, registrations, events, checkpoints, teams } from '@/db/schema';
import { eq, desc, gt, and, count } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Activity, Star, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';
import { FoldCard } from '@/components/ui/origami/fold-card';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) return redirect('/login');

    const userId = session.user.id;

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!user) return redirect('/login');

    const betterPlayers = await db.select({ count: count() })
        .from(users)
        .where(gt(users.xpPoints, user.xpPoints || 0));

    const rank = betterPlayers[0].count + 1;

    const myEvents = await db.select({
        event: events,
        reg: registrations,
        team: teams
    })
        .from(registrations)
        .innerJoin(events, eq(registrations.eventId, events.id))
        .leftJoin(teams, eq(registrations.teamId, teams.id))
        .where(eq(registrations.userId, userId))
        .orderBy(desc(registrations.createdAt));

    const recentActivity = await db.select({
        checkpoint: checkpoints,
        event: events
    })
        .from(checkpoints)
        .innerJoin(registrations, eq(checkpoints.registrationId, registrations.id))
        .innerJoin(events, eq(registrations.eventId, events.id))
        .where(and(
            eq(registrations.userId, userId),
            eq(checkpoints.isApproved, true)
        ))
        .orderBy(desc(checkpoints.createdAt))
        .limit(5);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans text-[#E8EAED]">
            {/* Header Section */}
            <div className="relative border-4 border-black bg-[#303134] p-8 shatter-shadow">
                <div className="absolute top-4 right-4 z-10">
                    <EditProfileDialog user={user} />
                </div>

                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Avatar Block */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-shatter-yellow translate-x-3 translate-y-3 border-2 border-black" />
                        <Avatar className="size-32 md:size-40 border-4 border-black rounded-none relative bg-[#202124]">
                            <AvatarImage src={user.image || ''} />
                            <AvatarFallback className="text-6xl font-black bg-[#202124] text-[#E8EAED] rounded-none">
                                {user.name?.[0] || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-[#E8EAED] leading-none mb-2">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="px-3 py-1 bg-black text-[#E8EAED] font-bold uppercase text-xs tracking-widest transform skew-x-[-12deg]">
                                    {user.role}
                                </span>
                                <span className="font-mono font-bold text-[#9AA0A6] text-sm">
                                     // {user.email}
                                </span>
                            </div>
                        </div>

                        {user.bio && (
                            <p className="text-lg font-bold text-[#E8EAED] border-l-4 border-shatter-pink pl-4 italic">
                                "{user.bio}"
                            </p>
                        )}

                        <div className="flex gap-4 pt-2">
                            {user.githubId && (
                                <a href={user.githubId.startsWith('http') ? user.githubId : `https://github.com/${user.githubId}`} target="_blank" className="p-2 border-2 border-black hover:bg-black hover:text-[#E8EAED] transition-colors">
                                    <Github className="size-5" />
                                </a>
                            )}
                            {user.linkedinId && (
                                <a href={user.linkedinId.startsWith('http') ? user.linkedinId : `https://linkedin.com/in/${user.linkedinId}`} target="_blank" className="p-2 border-2 border-black hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-colors">
                                    <Linkedin className="size-5" />
                                </a>
                            )}
                        </div>

                        <p className="text-xs font-black text-[#9AA0A6] uppercase tracking-widest">
                            OPERATIVE SINCE {new Date(user.createdAt!).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Stats Block */}
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="bg-black text-white p-4 border-2 border-black min-w-[140px] text-center transform rotate-2">
                            <div className="text-4xl font-black italic text-shatter-yellow">{user.xpPoints}</div>
                            <div className="text-xs font-black uppercase tracking-widest">Total XP</div>
                        </div>
                        <div className="bg-[#202124] text-[#E8EAED] p-4 border-2 border-black min-w-[140px] text-center transform -rotate-2">
                            <div className="text-4xl font-black italic">#{rank}</div>
                            <div className="text-xs font-black uppercase tracking-widest text-[#9AA0A6]">Global Rank</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* My Events */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-[#E8EAED]">
                        <Calendar className="size-8 text-[#E8EAED]" /> My Events
                    </h2>

                    {myEvents.length === 0 ? (
                        <div className="border-4 border-black border-dashed p-12 text-center bg-[#303134]">
                            <p className="font-bold text-[#9AA0A6] mb-4 uppercase">No active missions.</p>
                            <Link href="/dashboard/events">
                                <Button className="bg-black text-white font-black uppercase tracking-widest hover:bg-shatter-pink">Explore Events</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myEvents.map(({ event, reg, team }) => (
                                <Link key={event.id} href={`/dashboard/events/${event.slug}`}>
                                    <FoldCard className="p-0 border-2 border-black hover:border-shatter-yellow transition-colors group">
                                        <div className="flex items-stretch min-h-[100px]">
                                            <div className="w-24 bg-black flex items-center justify-center text-[#E8EAED] font-black text-4xl p-4 shrink-0">
                                                {event.title[0]}
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col justify-center bg-[#303134]">
                                                <h3 className="text-xl font-black uppercase italic tracking-tight group-hover:text-shatter-pink transition-colors text-[#E8EAED]">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs font-bold uppercase bg-black text-[#E8EAED] px-2 py-0.5">{event.type}</span>
                                                    {team && <span className="text-xs font-bold text-[#9AA0A6]">TEAM: {team.name}</span>}
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-32 flex items-center justify-center font-black uppercase tracking-widest text-xs border-l-2 border-black",
                                                reg.status === 'accepted' ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                                            )}>
                                                {reg.status}
                                            </div>
                                        </div>
                                    </FoldCard>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-[#E8EAED]">
                        <Activity className="size-8 text-shatter-pink" /> Activity
                    </h2>

                    <div className="relative border-l-4 border-black ml-4 space-y-8 py-4">
                        {recentActivity.length === 0 ? (
                            <p className="pl-6 text-[#9AA0A6] font-bold text-sm uppercase">No recent activity.</p>
                        ) : (
                            recentActivity.map((act, i) => (
                                <div key={act.checkpoint.id} className="relative pl-8">
                                    <div className="absolute -left-[10px] top-1 size-4 bg-shatter-yellow border-2 border-black rounded-none transform rotate-45" />

                                    <div className="bg-[#303134] border-2 border-black p-4 shatter-shadow-sm hover:translate-x-1 transition-transform">
                                        <div className="text-sm font-black uppercase text-[#E8EAED] mb-1">
                                            Checkpoint Cleared
                                        </div>
                                        <p className="text-xs font-bold text-[#9AA0A6] uppercase tracking-wide mb-2">
                                            {act.event.title}
                                        </p>
                                        <div className="inline-flex items-center gap-1 text-xs font-black text-black bg-shatter-yellow px-2 py-0.5 border border-black transform skew-x-[-12deg]">
                                            <Star className="size-3 fill-black" /> +100 XP
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
