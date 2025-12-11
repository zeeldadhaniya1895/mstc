
import { db } from '@/lib/db';
import { events, registrations, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { DomainAssigner } from '@/components/admin/domain-assigner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
            team: true
        },
        orderBy: [desc(registrations.createdAt)]
    });

    const domains = event.config?.availableDomains || [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Registrations: {event.title}</h1>
            </div>

            <div className="grid gap-6">
                {allRegistrations.map((reg) => (
                    <Card key={reg.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white">{reg.user.name}</h3>
                                <p className="text-sm text-gray-400">{reg.user.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="capitalize">{reg.status}</Badge>
                                    {reg.team && (
                                        <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                                            Team: {reg.team.name}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Domain Management Section (Only for Mentorship) */}
                            {event.type === 'mentorship' && (
                                <div className="w-full md:w-64 border-l border-white/10 pl-6">
                                    <DomainAssigner
                                        registrationId={reg.id}
                                        currentDomain={reg.assignedDomain}
                                        availableDomains={domains}
                                        priorities={reg.domainPriorities as string[]}
                                    />
                                </div>
                            )}

                            {/* Additional Answers Preview */}
                            {reg.customAnswers && Object.keys(reg.customAnswers as object).length > 0 && (
                                <div className="w-full md:w-64 border-l border-white/10 pl-6 text-sm text-gray-400">
                                    <div className="font-semibold text-gray-500 mb-1">Details</div>
                                    <pre className="whitespace-pre-wrap font-sans text-xs opacity-70">
                                        {JSON.stringify(reg.customAnswers, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {allRegistrations.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No registrations found.
                    </div>
                )}
            </div>
        </div>
    );
}
