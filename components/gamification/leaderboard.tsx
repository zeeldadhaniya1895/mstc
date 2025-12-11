
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardUser {
    id: string;
    name: string | null;
    email: string;
    xpPoints: number;
    role: string;
    image: string | null;
}

export default function Leaderboard({ users }: { users: LeaderboardUser[] }) {
    if (!users || users.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <Trophy className="size-16 mx-auto mb-4 opacity-20" />
                <p>No rankings available yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top 3 Podium (Visual) - Only if we have at least 3 users, or just show list */}
            {/* For simplicity and robustness, let's stick to a premium list view where top 3 are highlighted */}

            <div className="grid gap-4">
                {users.map((user, index) => {
                    const rank = index + 1;
                    let rankIcon;
                    let rankColor = "text-gray-400";
                    let glow = "";

                    if (rank === 1) {
                        rankIcon = <Crown className="size-6 text-yellow-400 fill-yellow-400/20" />;
                        rankColor = "text-yellow-400";
                        glow = "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)] bg-yellow-500/5";
                    } else if (rank === 2) {
                        rankIcon = <Medal className="size-6 text-gray-300" />;
                        rankColor = "text-gray-300";
                        glow = "border-gray-400/50 bg-white/5";
                    } else if (rank === 3) {
                        rankIcon = <Medal className="size-6 text-amber-600" />;
                        rankColor = "text-amber-600";
                        glow = "border-amber-700/50 bg-amber-900/10";
                    } else {
                        rankIcon = <span className="font-mono font-bold text-lg w-6 text-center">{rank}</span>;
                        glow = "border-white/5 hover:border-white/10 bg-black/20";
                    }

                    return (
                        <Card key={user.id} className={`border transition-all duration-300 ${glow}`}>
                            <CardContent className="flex items-center gap-4 p-4">
                                {/* Rank */}
                                <div className={`flex items-center justify-center w-8 ${rankColor}`}>
                                    {rankIcon}
                                </div>

                                {/* Avatar */}
                                <Avatar className={`size-10 md:size-12 border-2 ${rank === 1 ? 'border-yellow-500' : 'border-transparent'}`}>
                                    <AvatarImage src={user.image || ''} />
                                    <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>

                                {/* details */}
                                <div className="flex-1">
                                    <h3 className={`font-bold text-lg ${rank === 1 ? 'text-yellow-400' : 'text-white'}`}>
                                        {user.name || 'Anonymous User'}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {user.role !== 'student' && <span className="capitalize text-cyan-500 mr-2">{user.role}</span>}
                                        {user.email}
                                    </p>
                                </div>

                                {/* XP */}
                                <div className="text-right">
                                    <div className="text-2xl font-black text-cyan-400 font-mono tracking-tighter">
                                        {user.xpPoints}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-widest text-gray-500">XP Points</div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
