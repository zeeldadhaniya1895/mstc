
'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutDashboard, Users, Settings, Trophy, LogOut, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Legacy', href: '/admin/legacy', icon: Trophy }, // Using Trophy for Legacy/History
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-[#0f0f0f] text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full bg-[#141414]">
                <div className="h-16 flex items-center px-6 border-b border-white/10 gap-2">
                    <Terminal className="text-cyan-400 size-6" />
                    <span className="font-bold text-lg tracking-tight">MSTC Admin</span>
                </div>

                <div className="flex-1 py-6 px-3 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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

                <div className="p-4 border-t border-white/10">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
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
