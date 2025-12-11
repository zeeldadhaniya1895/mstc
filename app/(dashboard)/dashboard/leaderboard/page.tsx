
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { desc, gt } from 'drizzle-orm';
import Leaderboard from '@/components/gamification/leaderboard';
import { Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
    // Fetch top 50 users sorted by XP
    // Only fetch users with > 0 XP to keep the list meaningful? Or show everyone?
    // Let's show top 50 regardless, but usually > 0 is better. Let's do all for now.
    const topUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        xpPoints: users.xpPoints,
        role: users.role,
        image: users.image
    })
        .from(users)
        .orderBy(desc(users.xpPoints)) // Sort by XP descending
        .limit(50);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/50 mb-4">
                    <Trophy className="size-8" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Global Leaderboard</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    The top performers of the MSTC community. Complete checkpoints, help others, and attend events to climb the ranks.
                </p>
            </div>

            <Leaderboard users={topUsers as any[]} />
        </div>
    );
}
