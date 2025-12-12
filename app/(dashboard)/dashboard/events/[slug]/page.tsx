
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

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await auth();

    const event = await db.query.events.findFirst({
        where: eq(events.slug, slug)
    });

    if (!event) return notFound();

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
        <div className="space-y-8">
            {/* Hall of Fame Section */}
            {awards.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-500/20 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy className="size-48 text-yellow-500" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2 mb-6">
                            <Trophy className="size-6" /> Hall of Fame
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {awards.map((award) => (
                                <Card key={award.id} className="bg-black/40 border-yellow-500/30">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="size-12 bg-yellow-500 text-black font-black text-xl rounded-full flex items-center justify-center border-4 border-black shrink-0">
                                            #{award.rank}
                                        </div>
                                        <div>
                                            <div className="text-yellow-200 font-bold mb-1">{award.title}</div>
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
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/40 to-black border border-white/10 p-8 min-h-[300px] flex flex-col justify-end">
                        {event.posterUrl && (
                            <div className="absolute inset-0 opacity-20">
                                <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <Badge className="bg-white/10 backdrop-blur text-white border-white/10 capitalize text-base px-4 py-1">
                                {event.type.replace('_', ' ')}
                            </Badge>
                        </div>

                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>

                            <div className="flex flex-wrap gap-6 text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-5 text-cyan-400" />
                                    <span>
                                        {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}
                                        {event.endDate ? ` - ${new Date(event.endDate).toLocaleDateString()}` : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="size-5 text-purple-400" />
                                    <span>{event.config?.maxTeamSize ? `Teams of ${event.config.maxTeamSize}` : 'Individual'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="size-5 text-green-400" />
                                    <span>{event.status === 'live' ? 'Live Now' : event.status === 'past' ? 'Completed' : 'Registrations Open'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">About this Event</h2>
                        <p className="text-gray-400 leading-relaxed">
                            {/* Placeholder for now */}
                            This event is designed to push your limits. Join us to build, learn, and compete.
                            Review the roadmap and prepare your team for the challenge.
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="sticky top-8 bg-white/5 border border-white/10 rounded-xl p-6">
                        {isRegistered ? (
                            <div className="text-center space-y-6">
                                <div className="size-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">You are Registered!</h3>
                                    <p className="text-gray-400 text-sm">Get ready to build something amazing.</p>
                                </div>
                                <Link href={`/dashboard/events/${slug}/roadmap`} className="block">
                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 text-lg">
                                        View Roadmap
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-6">Register Now</h3>
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
                                                    Missed the deadline? Contact <a href="mailto:microsoftclub@dau.ac.in" className="text-cyan-400 hover:underline">microsoftclub@dau.ac.in</a> to request registration.
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
    );
}
