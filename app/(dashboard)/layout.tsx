
'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutDashboard, User, Trophy, LogOut, Terminal, Map, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Events', href: '/dashboard/events', icon: Calendar },
    { name: 'My Teams', href: '/dashboard/teams', icon: User }, // Or Users?
    { name: 'Roadmaps', href: '/dashboard/roadmaps', icon: Map },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <div className="min-h-screen flex bg-[#0f0f0f] text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full bg-[#141414]">
                <div className="h-16 flex items-center px-6 border-b border-white/10 gap-2">
                    <Terminal className="text-cyan-400 size-6" />
                    <span className="font-bold text-lg tracking-tight">MSTC Student</span>
                </div>

                <div className="flex-1 py-6 px-3 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                                    <item.icon className="size-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/10 space-y-2">
                    {/* Admin Link for Non-Students */}
                    {status === 'authenticated' && session?.user?.role !== 'student' && (
                        <Link href="/admin">
                            <Button variant="ghost" className="w-full justify-start gap-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-2">
                                <Terminal className="size-4" /> Admin Panel
                            </Button>
                        </Link>
                    )}

                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/10">
                            <ArrowLeft className="size-4" /> Back to Website
                        </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })} className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="size-4" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
