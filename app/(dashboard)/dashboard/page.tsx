
import { auth } from '@/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
    const session = await auth();

    // Fetch real user data
    let userXp = 0;
    let activeEventsCount = 0;

    if (session?.user?.id) {
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            with: {
                registrations: true
            }
        });
        userXp = dbUser?.xpPoints || 0;
        activeEventsCount = dbUser?.registrations.length || 0;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Hello, {session?.user?.name || 'Student'}</h1>
                <p className="text-gray-400">Welcome to your MSTC command center.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-transparent border-purple-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Trophy className="size-6 text-purple-400" />
                        </div>
                        <span className="text-2xl font-bold font-mono">{userXp}</span>
                    </div>
                    <div className="text-sm text-gray-400">XP Points Earned</div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-transparent border-blue-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Zap className="size-6 text-blue-400" />
                        </div>
                        <span className="text-2xl font-bold font-mono">{activeEventsCount}</span>
                    </div>
                    <div className="text-sm text-gray-400">Active Events</div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-900/20 to-transparent border-green-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Calendar className="size-6 text-green-400" />
                        </div>
                        <span className="text-2xl font-bold font-mono">5</span>
                    </div>
                    <div className="text-sm text-gray-400">Days Streak</div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Active Event - Live Action */}
                <Card className="p-6 bg-white/5 border-white/10">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live Now: Winter of Code
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                            <div className="text-sm text-gray-400 mb-1">Current Milestone</div>
                            <div className="font-semibold text-cyan-400">Mid-Evaluation Checkpoint</div>
                            <div className="mt-2 text-xs text-gray-500">Due in 2 days</div>
                        </div>

                        <Link href="/dashboard/events/woc-2025">
                            <Button className="w-full bg-white text-black hover:bg-gray-200">
                                Continue Working <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Recent Activity / Roadmap */}
                <Card className="p-6 bg-white/5 border-white/10">
                    <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 text-sm">
                                <div className="size-2 rounded-full bg-gray-600" />
                                <div className="flex-1">
                                    <span className="text-gray-300">Submitted Pull Request to </span>
                                    <span className="text-cyan-400 font-mono">mstc/website</span>
                                </div>
                                <div className="text-gray-500 text-xs">2h ago</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
