'use client';

import { Button } from "@/components/ui/button";
import { FoldCard } from "@/components/ui/origami/fold-card"; // Actually ShatterCard now
import { Calendar, MapPin, ArrowUpRight, Trophy, Users } from "lucide-react";
import Link from 'next/link';

// Mock data
const events = [
    {
        id: "1",
        title: "Hacktoberfest 2025",
        date: "Oct 1-31",
        type: "Open Source",
        status: "upcoming",
        image: "/placeholder" // We'll use a color block
    },
    {
        id: "2",
        title: "Code Wars V",
        date: "Nov 15",
        type: "Competitive",
        status: "live",
        image: "/placeholder"
    },
    {
        id: "3",
        title: "AI Workshop",
        date: "Dec 05",
        type: "Workshop",
        status: "past",
        image: "/placeholder"
    }
];

export default function EventsPage() {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 font-sans">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-[#E8EAED]">
                        EVENTS <span className="text-shatter-yellow">LOG</span>
                    </h1>
                    <p className="text-[#9AA0A6] font-bold uppercase tracking-widest mt-2">
                        Participate // Compete // Win
                    </p>
                </div>
                <Button className="h-12 px-8 bg-black hover:bg-shatter-pink text-white font-black uppercase tracking-widest border-2 border-transparent hover:border-black rounded-none shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                    Create Event
                </Button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <FoldCard key={event.id} className="p-0 flex flex-col h-full bg-[#303134] group hover:z-10 relative border-2 border-black">
                        {/* Event Image / Block */}
                        <div className="h-48 w-full bg-[#202124] relative border-b-4 border-black overflow-hidden group-hover:bg-shatter-yellow transition-colors">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <Trophy className="size-24 text-[#9AA0A6] group-hover:text-black transform -rotate-12" />
                            </div>

                            <div className="absolute top-4 right-4 bg-[#303134] border-2 border-black px-3 py-1 text-xs font-black uppercase text-[#E8EAED] shadow-[2px_2px_0px_black]">
                                {event.status}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-[#202124] border border-black text-xs font-bold uppercase text-[#E8EAED]">
                                    {event.type}
                                </span>
                                <span className="text-xs font-mono font-bold text-[#9AA0A6] ml-auto flex items-center gap-1">
                                    <Calendar className="size-3" /> {event.date}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black uppercase leading-none mb-2 text-[#E8EAED] group-hover:text-shatter-pink transition-colors">
                                {event.title}
                            </h3>

                            <div className="h-1 w-12 bg-black my-4" />

                            <p className="text-sm font-bold text-[#9AA0A6] mb-6 flex-1">
                                Join the ultimate {event.type.toLowerCase()} challenge. prove your worth.
                            </p>

                            <Button className="w-full h-12 bg-[#202124] text-[#E8EAED] border-4 border-black font-black uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-between px-6 rounded-none">
                                Register <ArrowUpRight className="size-5" />
                            </Button>
                        </div>
                    </FoldCard>
                ))}
            </div>
        </div>
    );
}
