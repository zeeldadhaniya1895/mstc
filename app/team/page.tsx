
import { Navbar } from '@/components/navbar';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { not } from 'drizzle-orm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { eq } from 'drizzle-orm';
import { Github, Linkedin } from 'lucide-react';

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
                                <div className="aspect-[4/5] relative overflow-hidden">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name || 'Team Member'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-700 bg-gradient-to-br from-gray-900 to-black">
                                            {member.name?.[0] || 'U'}
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    {/* Content Container */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                            <h3 className="font-bold text-xl text-white mb-1 group-hover:text-cyan-400 transition-colors">{member.name || 'Unknown User'}</h3>
                                            <Badge variant="secondary" className="capitalize bg-cyan-950/80 text-cyan-300 border-cyan-800/50 backdrop-blur-sm mb-2">
                                                {member.role?.replace('_', ' ')}
                                            </Badge>

                                            {/* Bio - Visible on Hover */}
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                                                <div className="overflow-hidden">
                                                    <p className="text-sm text-gray-300 italic mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                        "{member.bio || 'No bio available.'}"
                                                    </p>

                                                    <div className="flex gap-3 pt-2 border-t border-white/10">
                                                        {member.githubId && (
                                                            <a href={member.githubId.startsWith('http') ? member.githubId : `https://github.com/${member.githubId}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                                                <Github className="size-4" />
                                                            </a>
                                                        )}
                                                        {member.linkedinId && (
                                                            <a href={member.linkedinId.startsWith('http') ? member.linkedinId : `https://linkedin.com/in/${member.linkedinId}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                                                <Linkedin className="size-4" />
                                                            </a>
                                                        )}
                                                        {!member.githubId && !member.linkedinId && (
                                                            <span className="text-xs text-gray-500 py-2">No socials linked</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Always visible email on mobile/collapsed, hidden on hover to make room? No, better keep it simple. */}
                                            {/* Let's just keep email visible if space permits or hide it in the collapsed view to be cleaner */}
                                            <p className="text-xs text-gray-500 mt-2 truncate group-hover:hidden transition-display">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
