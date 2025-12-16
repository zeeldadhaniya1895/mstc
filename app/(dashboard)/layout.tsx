'use client';

import { OrigamiSidebar } from '@/components/ui/origami/origami-sidebar';
import { ShatterBackground } from '@/components/ui/shatter-background';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen text-[#E8EAED] font-sans relative bg-[#202124]">

            {/* Animated Background Layer */}
            <ShatterBackground />

            {/* The Origami Sidebar - Fixed Left */}
            <OrigamiSidebar />

            {/* Main Content Area - Pushed right to accommodate the 300px wide sidebar */}
            <main className="relative z-10 px-6 py-10 md:pl-[332px] min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
