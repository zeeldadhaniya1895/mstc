'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Loader2, Map } from 'lucide-react';
import { StaticRoadmaps } from './static-roadmaps';
import { LiveRoadmaps } from './live-roadmaps';
import { fetchLiveRoadmaps } from '@/app/actions/roadmaps';
import { cn } from '@/lib/utils';

export function RoadmapsView() {
    const [activeTab, setActiveTab] = useState<'static' | 'live'>('static');
    const [liveData, setLiveData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSwitchToLive = async () => {
        setActiveTab('live');
        if (!liveData) {
            setLoading(true);
            try {
                const data = await fetchLiveRoadmaps();
                setLiveData(data);
            } catch (error) {
                console.error("Failed to fetch live roadmaps", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-black pb-6">
                <div className="flex flex-col">
                    <h1 className="text-5xl font-black flex items-center gap-3 uppercase italic tracking-tighter text-[#E8EAED]">
                        Roadmaps <span className="text-shatter-pink">_</span>
                    </h1>
                    <p className="text-[#9AA0A6] font-bold uppercase tracking-widest mt-2">
                        Master your craft. Follow the path.
                    </p>
                </div>

                {/* Tabs Switcher - Shatter Style */}
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('static')}
                        className={cn(
                            "h-12 px-6 border-4 border-black font-black uppercase tracking-widest rounded-none transition-all",
                            activeTab === 'static'
                                ? "bg-shatter-yellow text-black shadow-[4px_4px_0px_black] translate-x-[-2px] translate-y-[-2px]"
                                : "bg-[#303134] text-[#9AA0A6] hover:bg-black hover:text-[#E8EAED]"
                        )}
                    >
                        Standard
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleSwitchToLive}
                        className={cn(
                            "h-12 px-6 border-4 border-black font-black uppercase tracking-widest rounded-none transition-all",
                            activeTab === 'live'
                                ? "bg-shatter-pink text-white shadow-[4px_4px_0px_black] translate-x-[-2px] translate-y-[-2px]"
                                : "bg-[#303134] text-[#9AA0A6] hover:bg-black hover:text-[#E8EAED]"
                        )}
                    >
                        <Zap className="size-4 mr-2" /> Live Events
                    </Button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[400px]">
                {activeTab === 'static' ? (
                    <StaticRoadmaps />
                ) : (
                    <>
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="size-16 text-shatter-yellow animate-spin" />
                            </div>
                        ) : (
                            <LiveRoadmaps roadmaps={liveData || []} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
