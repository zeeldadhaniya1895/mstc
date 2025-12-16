import { auth } from "@/auth";
import { FoldCard } from "@/components/ui/origami/fold-card";
import { Activity, Trophy, Zap, Map, ArrowUpRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserStats, getUserRecentActivity } from "@/lib/data-fetching";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        // Should be handled by middleware, but safe check
        return redirect("/");
    }

    const [stats, recentActivity] = await Promise.all([
        getUserStats(session.user.id),
        getUserRecentActivity(session.user.id)
    ]);

    // Inference for Batch/Roll
    const displayRollNo = stats?.collegeId || 'PENDING';
    const displayBatch = session.user.email?.match(/20\d{2}/)?.[0] || '2024';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 gap-4 border-b-4 border-black bg-[#303134]/50 backdrop-blur-sm p-4">
                <div className="relative">
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#E8EAED] italic leading-[0.8] mb-2">
                        DASHBOARD
                        <span className="inline-block w-8 h-4 bg-shatter-pink ml-2 mb-2 skew-x-[-12deg] shadow-[4px_4px_0px_black]" />
                    </h1>

                    <div className="text-[#9AA0A6] font-mono text-sm font-bold uppercase tracking-[0.2em] flex flex-col md:flex-row md:items-center gap-2 items-start">
                        <span className="flex items-center gap-2">
                            OPERATIVE: <span className="bg-black text-[#E8EAED] px-1">{session?.user?.name || 'UNKNOWN'}</span>
                        </span>
                        <span className="hidden md:inline text-shatter-pink">//</span>
                        <span className="flex items-center gap-2">
                            STATUS: <span className="text-green-400 bg-green-900/30 px-1 border border-black">GREEN</span>
                        </span>
                    </div>
                </div>

                <div className="hidden md:block">
                    <div className="bg-shatter-yellow border-2 border-black px-6 py-2 transform skew-x-[-12deg] shadow-[4px_4px_0px_black]">
                        <span className="text-black font-black text-xl italic tracking-widest transform skew-x-[12deg] inline-block">
                            {new Date().toLocaleDateString('en-GB')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total XP" value={stats?.xpPoints || "0"} icon={Zap} accent="flame" />
                <StatCard title="Global Rank" value={stats?.globalRank || "-"} icon={Trophy} accent="blue" />
                <StatCard title="Events" value={stats?.eventsCount || "0"} icon={Map} accent="void" />
                <StatCard title="Activity" value={stats?.activityLevel || "Low"} icon={Activity} accent="void" />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Recent Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#E8EAED] flex items-center gap-2">
                        Mission Log
                    </h2>
                    <FoldCard className="min-h-[300px] border-none shadow-none p-0 bg-transparent hover:translate-none hover:shadow-none">
                        <div className="space-y-4">
                            {recentActivity.length === 0 ? (
                                <div className="p-8 border-4 border-black bg-[#303134] text-center text-[#9AA0A6] font-bold uppercase border-dashed">
                                    No recent activity detected.
                                </div>
                            ) : (
                                recentActivity.map((item, i) => (
                                    <div key={item.id} className="group flex items-center gap-4 p-4 bg-[#303134] border-4 border-black shatter-shadow-sm hover:translate-x-1 transition-transform relative overflow-hidden">
                                        {/* Hover Reveal Background */}
                                        <div className="absolute inset-0 bg-shatter-yellow translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 z-0" />

                                        <div className={cn(
                                            "relative z-10 p-3 border-2 border-black font-black",
                                            i % 2 === 0 ? "bg-black text-white" : "bg-shatter-pink text-white"
                                        )}>
                                            0{i + 1}
                                        </div>
                                        <div className="flex-1 relative z-10">
                                            <p className="text-[#E8EAED] font-black text-lg uppercase leading-none group-hover:text-black group-hover:underline truncate">{item.eventTitle || 'Unknown Event'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs text-[#9AA0A6] font-mono font-bold group-hover:text-black uppercase">
                                                    {item.status} // {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown Date'}
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="relative z-10 size-6 text-[#E8EAED] opacity-0 group-hover:opacity-100 group-hover:text-black transition-opacity" />
                                    </div>
                                ))
                            )}
                        </div>
                    </FoldCard>
                </div>

                {/* Right: Profile Dossier Mini */}
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#E8EAED] mb-6">Operative Card</h2>
                    <FoldCard accent="blue" className="text-center py-8 bg-[#303134] border-4 border-black shadow-[8px_8px_0px_black]">
                        <div className="size-32 mx-auto bg-[#202124] border-4 border-black mb-6 overflow-hidden shadow-[4px_4px_0px_black] relative rotate-3 hover:rotate-0 transition-transform">
                            {/* Avatar Placeholder */}
                            <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-shatter-grey text-[#E8EAED]">
                                {session?.user?.name?.[0]}
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-[#E8EAED] uppercase italic tracking-tighter mb-1 truncate px-2">{session?.user?.name}</h3>
                        <p className="text-sm text-[#9AA0A6] font-mono font-bold mb-6 truncate px-2">{session?.user?.email}</p>

                        <div className="grid grid-cols-2 gap-2 bg-black p-1 border-2 border-black mx-2">
                            <div className="bg-shatter-yellow p-2 text-center text-xs font-black uppercase text-black">ROLL_NO</div>
                            <div className="bg-[#303134] p-2 text-center text-xs font-bold text-[#E8EAED] border border-black truncate">{displayRollNo}</div>
                            <div className="bg-shatter-yellow p-2 text-center text-xs font-black uppercase text-black">BATCH</div>
                            <div className="bg-[#303134] p-2 text-center text-xs font-bold text-[#E8EAED] border border-black">{displayBatch}</div>
                        </div>
                    </FoldCard>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, accent }: { title: string, value: string, icon: any, accent: 'flame' | 'blue' | 'void' }) {
    return (
        <FoldCard accent={accent} className="p-6 flex items-center justify-between group cursor-default h-32 hover:bg-black hover:text-[#E8EAED] transition-colors duration-300">
            <div className="relative z-10">
                <p className="text-xs font-black text-[#9AA0A6] uppercase tracking-widest mb-1 group-hover:text-shatter-yellow transition-colors">{title}</p>
                <p className="text-4xl font-black text-[#E8EAED] italic group-hover:text-white transition-colors">{value}</p>
            </div>
            <div className={cn(
                "relative z-10 p-3 border-4 border-black shadow-[4px_4px_0px_black] group-hover:shadow-[4px_4px_0px_white] group-hover:border-white transition-all transform group-hover:rotate-12",
                accent === 'flame' ? "bg-shatter-pink text-white" :
                    accent === 'blue' ? "bg-shatter-yellow text-black" : "bg-[#303134] text-[#E8EAED]"
            )}>
                <Icon className="size-6" />
            </div>
        </FoldCard>
    );
}
