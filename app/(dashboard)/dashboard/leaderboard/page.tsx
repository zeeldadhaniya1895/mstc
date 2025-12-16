
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
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
                {/* Icon Container - Shatter Style */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-shatter-yellow translate-x-2 translate-y-2 border-2 border-black" />
                    <div className="relative bg-white border-2 border-black p-4 inline-flex items-center justify-center">
                        <Trophy className="size-10 text-black" />
                    </div>
                </div>

                {/* Main Title */}
                <h1 className="text-center text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-[#E8EAED] leading-[0.9]">
                    Global <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8EAED] via-[#E8EAED] to-[#9AA0A6]">Leaderboard</span>
                    <span className="text-shatter-pink text-4xl md:text-6xl">_</span>
                </h1>

                {/* Subtitle */}
                <p className="text-center text-lg font-bold text-[#9AA0A6] max-w-2xl mx-auto uppercase tracking-wide">
                    The top performers of the MSTC community. <span className="text-black bg-shatter-yellow px-1">Climb the ranks.</span>
                </p>
            </div>

            <Leaderboard users={topUsers as any[]} />
        </div>
    );
}
