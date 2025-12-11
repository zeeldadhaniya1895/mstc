'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type EventItem = {
    title: string;
    date: string;
    status: string;
    type: string;
};

export function Timeline({ events }: { events: EventItem[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-20" ref={containerRef}>
            <div className="relative">
                {/* Central Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 md:-translate-x-1/2">
                    <motion.div
                        style={{ height }}
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                    />
                </div>

                <div className="space-y-12 md:space-y-24 relative z-10">
                    {events.map((event, index) => (
                        <TimelineItem key={index} event={event} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ event, index }: { event: EventItem; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className={cn(
                "relative flex flex-col md:flex-row items-center",
                isEven ? "md:flex-row-reverse" : ""
            )}
        >
            {/* Spacer for Desktop Alignment */}
            <div className="hidden md:block w-1/2" />

            {/* Timeline Node/Dot */}
            <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-black border-2 border-neon-cyan rounded-full md:-translate-x-1/2 z-20 shadow-[0_0_10px_rgba(0,243,255,0.8)] mt-6 md:mt-0">
                <div className="absolute inset-0 bg-neon-cyan/50 rounded-full animate-ping opacity-75" />
            </div>

            {/* Content Card */}
            <div className={cn(
                "w-full md:w-1/2 pl-20 md:pl-0",
                isEven ? "md:pr-12 text-left" : "md:pl-12 text-left"
            )}>
                <div className={cn(
                    "glass-card p-6 relative group hover:bg-white/5 transition-colors border-white/10",
                    "before:absolute before:top-8 before:w-8 before:h-[2px] before:bg-white/10",
                    isEven
                        ? "before:-right-8 before:hidden md:before:block" // Desktop: Line on right
                        : "before:-left-8 before:hidden md:before:block"  // Desktop: Line on left
                )}>
                    {/* Mobile connector line */}
                    <div className="absolute top-8 -left-12 w-8 h-[2px] bg-white/10 md:hidden" />

                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-4xl font-bold text-white/10 group-hover:text-neon-cyan transition-colors duration-300 font-mono">
                            {event.date}
                        </span>
                        <Badge variant="outline" className="border-neon-purple/50 text-neon-purple bg-neon-purple/5">
                            {event.type}
                        </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gradient transition-all">{event.title}</h3>
                    <p className="text-gray-400 text-sm">Join us for this flagship event. Mark your calendars.</p>
                </div>
            </div>
        </motion.div>
    );
}
