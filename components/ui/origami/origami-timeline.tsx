'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a util for classes

interface TimelineEvent {
    title: string;
    date: string;
    status: string;
    type: string;
}

export function OrigamiTimeline({ events }: { events: TimelineEvent[] }) {
    return (
        <div className="relative max-w-4xl mx-auto px-4 py-20">
            {/* Central Spine - Solid Black with Yellow Highlight */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black -translate-x-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-shatter-yellow/50 -translate-x-1/2 blur-lg -z-10" />

            <div className="space-y-24">
                {events.map((event, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={cn(
                            "relative flex items-center justify-between gap-8",
                            i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                        )}
                    >
                        {/* Content Card */}
                        <div className={cn("w-1/2 flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                            <div className="relative bg-[#303134] border-3 border-black p-6 w-full max-w-sm shatter-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_var(--color-shatter-pink)] transition-all group duration-300"
                                style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>

                                <div className="absolute top-0 right-0 p-2 font-mono text-xs font-bold text-[#E8EAED] border-l-2 border-b-2 border-black bg-[#303134]">
                                    {event.date}
                                </div>

                                <h3 className="text-xl font-black italic text-[#E8EAED] uppercase mb-2 group-hover:text-shatter-pink transition-colors">
                                    {event.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-black text-[#E8EAED] font-bold">
                                        {event.type}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-0.5 text-[10px] uppercase tracking-wider border-2 font-bold",
                                        event.status === 'upcoming' ? "border-shatter-pink text-shatter-pink" : "border-black text-[#E8EAED]"
                                    )}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Central Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                            <div className="size-6 bg-shatter-yellow border-4 border-black rotate-45 z-10 box-content shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
                        </div>

                        {/* Empty Space for alignment */}
                        <div className="w-1/2" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
