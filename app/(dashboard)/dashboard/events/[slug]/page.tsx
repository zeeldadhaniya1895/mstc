
import { db } from '@/lib/db';
import { events, registrations, eventAwards } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle2, Trophy } from 'lucide-react';
import DynamicRegistrationForm from '@/components/forms/dynamic-registration-form';
import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EVENT_THEME_CONFIG, EventThemeKey } from '@/lib/themes-config';
import { cn } from '@/lib/utils';
import { EventBackground } from '@/components/ui/event-background';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await auth();

    const event = await db.query.events.findFirst({
        where: eq(events.slug, slug)
    });

    if (!event) return notFound();

    const themeKey = (event.theme || 'default') as EventThemeKey;
    const theme = EVENT_THEME_CONFIG[themeKey] || EVENT_THEME_CONFIG['default'];

    // Check Registration Status
    let isRegistered = false;
    if (session?.user?.id) {
        const existingReg = await db.query.registrations.findFirst({
            where: and(
                eq(registrations.userId, session.user.id),
                eq(registrations.eventId, event.id)
            )
        });
        if (existingReg) isRegistered = true;
    }

    // Fetch Awards (Hall of Fame)
    const awards = await db.query.eventAwards.findMany({
        where: eq(eventAwards.eventId, event.id),
        with: {
            team: {
                with: {
                    registrations: {
                        with: { user: true }
                    }
                }
            },
            user: true
        },
        orderBy: [asc(eventAwards.rank)]
    });

    return (
        <div className="min-h-screen relative">
            <EventBackground theme={themeKey} />

            <div className="relative z-10 space-y-8 pb-20">
                {/* Hall of Fame Section */}
                {awards.length > 0 && (
                    <div className={cn("rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm", theme.card)}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Trophy className={cn("size-48", theme.icon)} />
                        </div>
                        <div className="relative z-10">
                            <h2 className={cn("text-2xl font-bold flex items-center gap-2 mb-6", theme.accent)}>
                                <Trophy className="size-6" /> Hall of Fame
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {awards.map((award) => (
                                    <Card key={award.id} className="bg-black/40 border-white/10">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className={cn("size-12 bg-white/10 text-white font-black text-xl rounded-full flex items-center justify-center border-2 border-white/20 shrink-0")}>
                                                #{award.rank}
                                            </div>
                                            <div>
                                                <div className={cn("font-bold mb-1", theme.accent)}>{award.title}</div>
                                                <div className="text-sm text-gray-400">
                                                    {award.team ? (
                                                        <div>
                                                            <div className="font-bold text-white text-base">{award.team.name}</div>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {award.team?.registrations.map((reg, idx) => (
                                                                    <span key={reg.id} className="text-xs text-gray-500">
                                                                        {reg.user.name}{idx < (award.team?.registrations.length || 0) - 1 ? ', ' : ''}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-base text-white">{award.user?.name}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Header */}
                        <div className={cn("relative rounded-2xl overflow-hidden border p-8 min-h-[300px] flex flex-col justify-end shadow-2xl", theme.card, "border-white/10")}>
                            {event.posterUrl && (
                                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                                    <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                                    <div className={cn("absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent")} />
                                </div>
                            )}
                            <div className="absolute top-6 left-6">
                                <Badge className={cn("backdrop-blur text-white border-white/10 capitalize text-base px-4 py-1", theme.accent.split(' ')[0], "bg-white/5")}>
                                    {event.type.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="relative z-10">
                                <h1 className={cn("text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-xl text-white")}>{event.title}</h1>

                                <div className="flex flex-wrap gap-6 text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className={cn("size-5", theme.icon)} />
                                        <span>
                                            {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}
                                            {event.endDate ? ` - ${new Date(event.endDate).toLocaleDateString()}` : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className={cn("size-5", theme.icon)} />
                                        <span>{event.config?.maxTeamSize ? `Teams of ${event.config.maxTeamSize}` : 'Individual'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className={cn("size-5", theme.icon)} />
                                        <span>{event.status === 'live' ? 'Live Now' : event.status === 'past' ? 'Completed' : 'Registrations Open'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Rules */}
                        <div className="space-y-8">
                            {event.description && (
                                <div className={cn("p-8 hover:scale-[1.02] transition-transform duration-300 rounded-2xl border backdrop-blur-md shadow-lg", theme.card)}>
                                    <div
                                        className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: event.description }}
                                    />
                                </div>
                            )}

                            {event.rules && (
                                <div className={cn("p-8 hover:scale-[1.02] transition-transform duration-300 rounded-2xl border backdrop-blur-md shadow-lg", theme.card)}>
                                    <div
                                        className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: event.rules }}
                                    />
                                </div>
                            )}

                            {!event.description && !event.rules && (
                                <div className={cn("p-8 hover:scale-[1.02] transition-transform duration-300 rounded-2xl border backdrop-blur-md shadow-lg", theme.card)}>
                                    <h2 className={cn("text-2xl font-bold mb-4", theme.accent)}>About this Event</h2>
                                    <p className="text-gray-400 leading-relaxed">
                                        This event is designed to push your limits. Join us to build, learn, and compete.
                                        Review the roadmap and prepare your team for the challenge.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className={cn("sticky top-8 border rounded-xl p-6 backdrop-blur-md shadow-xl fit-content", theme.card)}>
                            {isRegistered ? (
                                <div className="text-center space-y-6">
                                    <div className={cn("size-16 rounded-full flex items-center justify-center mx-auto bg-white/5", theme.icon)}>
                                        <CheckCircle2 className="size-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-white">You are Registered!</h3>
                                        <p className="text-gray-400 text-sm">Get ready to build something amazing.</p>
                                    </div>
                                    <Link href={`/dashboard/events/${slug}/roadmap`} className="block">
                                        <Button className={cn("w-full h-12 text-lg font-bold transition-all hover:scale-[1.02]", "bg-white text-black hover:bg-gray-200")}>
                                            View Roadmap
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <h3 className={cn("text-xl font-bold mb-6", theme.accent)}>Register Now</h3>
                                    {(() => {
                                        const now = new Date();
                                        const regStart = event.registrationStartDate ? new Date(event.registrationStartDate) : null;
                                        const regEnd = event.registrationEndDate ? new Date(event.registrationEndDate) : null;

                                        if (event.status === 'past') {
                                            return (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-center text-red-400">
                                                    Event Completed
                                                </div>
                                            );
                                        }

                                        if (regStart && now < regStart) {
                                            return (
                                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-center text-yellow-400">
                                                    Registrations open on {regStart.toLocaleDateString()} at {regStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                                                </div>
                                            );
                                        }

                                        if (regEnd && now > regEnd) {
                                            return (
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-center text-red-400">
                                                        Registrations Closed
                                                    </div>
                                                    <div className="text-sm text-gray-400 text-center">
                                                        Missed the deadline? Contact <a href="mailto:microsoftclub@dau.ac.in" className={cn("hover:underline", theme.accent)}>microsoftclub@dau.ac.in</a> to request registration.
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // Default: Open
                                        return <DynamicRegistrationForm config={event.config} eventId={event.id} />;
                                    })()}
                                    <p className="text-xs text-gray-500 mt-6 text-center">
                                        By registering, you agree to the MSTC Code of Conduct.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

