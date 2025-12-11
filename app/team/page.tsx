
import { Navbar } from '@/components/navbar';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { not } from 'drizzle-orm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
    // Fetch non-student users (Core Team, Conveners, etc.)
    const teamMembers = await db.query.users.findMany({
        where: not(eq(users.role, 'student')),
        orderBy: (users, { desc }) => [desc(users.role)], // Simple sort for now, ideally specific order
    });

    // Custom sorting helper to put Convener -> Deputy -> Core -> Member
    const roleOrder: Record<string, number> = {
        'convener': 1,
        'deputy_convener': 2,
        'core_member': 3,
        'member': 4
    };

    const sortedTeam = teamMembers.sort((a, b) => {
        return (roleOrder[a.role || 'member'] || 99) - (roleOrder[b.role || 'member'] || 99);
    });

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Meet The Team</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        The minds behind the magic. Get to know the people ensuring MSTC runs smoothly every single day.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedTeam.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <p>No team members found. (Are roles assigned in DB?)</p>
                        </div>
                    ) : (
                        sortedTeam.map((member) => (
                            <Card key={member.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-cyan-500/50 transition-all group">
                                <div className="aspect-square relative overflow-hidden bg-black/50">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name || 'Team Member'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-700 bg-black/20">
                                            {member.name?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4 space-y-2">
                                    <h3 className="font-bold text-lg truncate">{member.name || 'Unknown User'}</h3>
                                    <Badge variant="secondary" className="capitalize bg-cyan-950 text-cyan-400 border-cyan-800/50">
                                        {member.role?.replace('_', ' ')}
                                    </Badge>
                                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
