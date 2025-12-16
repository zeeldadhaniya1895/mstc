'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <div className="text-center py-12 border-4 border-black border-dashed bg-[#202124]">
                <Trophy className="size-16 mx-auto mb-4 text-[#E8EAED] opacity-20" />
                <p className="font-black uppercase tracking-widest text-[#9AA0A6]">No rankings available yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            <div className="grid gap-4">
                {users.map((user, index) => {
                    const rank = index + 1;

                    // Shatter Styling Logic
                    const isTop1 = rank === 1;
                    const isTop2 = rank === 2;
                    const isTop3 = rank === 3;

                    let bgClass = "bg-[#303134]";
                    let borderClass = "border-black";
                    let shadowClass = "shatter-shadow-sm";

                    if (isTop1) {
                        bgClass = "bg-shatter-yellow text-black";
                        shadowClass = "shadow-[8px_8px_0px_black]";
                    } else if (isTop2) {
                        bgClass = "bg-[#5F6368] text-[#E8EAED]"; // Google Grey 600
                        shadowClass = "shadow-[6px_6px_0px_black]";
                    } else if (isTop3) {
                        bgClass = "bg-[#804f3b] text-[#E8EAED]"; // Darker Bronze
                        shadowClass = "shadow-[4px_4px_0px_black]";
                    }

                    return (
                        <div
                            key={user.id}
                            className={cn(
                                "relative flex items-center gap-4 p-4 border-4 transition-transform hover:translate-x-1 duration-200",
                                bgClass,
                                borderClass,
                                shadowClass
                            )}
                        >
                            {/* Rank Indicator */}
                            <div className="flex items-center justify-center w-12 h-12 bg-black text-white font-black text-xl border-2 border-white/20 transform -rotate-3">
                                {isTop1 ? <Crown className="size-6 text-shatter-yellow" /> :
                                    isTop2 ? <Medal className="size-6 text-gray-300" /> :
                                        isTop3 ? <Medal className="size-6 text-orange-400" /> :
                                            <span>#{rank}</span>}
                            </div>

                            {/* Avatar */}
                            <Avatar className="size-12 md:size-14 border-4 border-black rounded-none">
                                <AvatarImage src={user.image || ''} />
                                <AvatarFallback className="rounded-none bg-[#202124] text-[#E8EAED] font-black">{user.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>

                            {/* Details */}
                            <div className="flex-1">
                                <h3 className={cn("font-black text-xl uppercase italic tracking-tighter", isTop1 ? "text-black" : "text-[#E8EAED]")}>
                                    {user.name || 'Anonymous User'}
                                </h3>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                    {user.role !== 'student' && (
                                        <span className="bg-black text-[#E8EAED] px-2 py-0.5 transform skew-x-[-12deg]">{user.role}</span>
                                    )}
                                    <span className={cn("font-mono", isTop1 ? "text-black/70" : "text-[#9AA0A6]")}>{user.email}</span>
                                </div>
                            </div>

                            {/* XP Badge */}
                            <div className="text-right bg-black text-white p-2 min-w-[100px] transform skew-x-[-12deg]">
                                <div className="text-2xl font-black italic transform skew-x-[12deg]">
                                    {user.xpPoints}
                                </div>
                                <div className="text-[10px] text-shatter-yellow font-bold uppercase tracking-widest transform skew-x-[12deg]">XP</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
