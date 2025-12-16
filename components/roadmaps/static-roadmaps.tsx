'use client';

import { FoldCard } from '@/components/ui/origami/fold-card';
import {
    Database,
    Sparkles,
    Code,
    Server,
    Smartphone,
    Terminal,
    Cpu,
    Link as LinkIcon,
    Brain,
    Layout,
    ArrowRight,
    Star
} from 'lucide-react';
import Link from 'next/link';

// Featured "Full Courses"
const featuredRoadmaps = [
    {
        id: 'mern',
        title: 'MERN Stack Full Course',
        description: 'Complete mastery of MongoDB, Express, React, and Node.js. Build enterprise-grade applications.',
        icon: Database,
        accent: 'flame',
        link: 'https://roadmap.sh/full-stack',
        bg: 'bg-[#202124] text-[#E8EAED] hover:bg-shatter-yellow hover:text-black'
    },
    {
        id: 'genai',
        title: 'Generative AI Special',
        description: 'Deep dive into LLMs, RAG, and AI engineering. The future of tech.',
        icon: Sparkles,
        accent: 'blue',
        link: 'https://roadmap.sh/ai-data-scientist',
        bg: 'bg-[#202124] text-[#E8EAED] hover:bg-shatter-pink hover:text-white'
    }
];

// Standard Domain Tracks
const domainRoadmaps = [
    { id: 'frontend', title: 'Frontend Dev', icon: Code, link: 'https://roadmap.sh/frontend' },
    { id: 'nodejs', title: 'NodeJS Backend', icon: Server, link: 'https://roadmap.sh/nodejs' },
    { id: 'flutter', title: 'Flutter App', icon: Smartphone, link: 'https://roadmap.sh/flutter' },
    { id: 'python', title: 'Python', icon: Terminal, link: 'https://roadmap.sh/python' },
    { id: 'dsa', title: 'CP & DSA', icon: Cpu, link: 'https://roadmap.sh/cpp' },
    { id: 'blockchain', title: 'Blockchain', icon: LinkIcon, link: 'https://roadmap.sh/blockchain' },
    { id: 'ml-nlp', title: 'ML & NLP', icon: Brain, link: 'https://roadmap.sh/ai-data-scientist' },
    { id: 'django', title: 'Django', icon: Layout, link: 'https://roadmap.sh/python' }
];

export function StaticRoadmaps() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">

            {/* FEATURED SECTION */}
            <section>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                    <Star className="size-8 text-shatter-yellow fill-shatter-yellow" /> Specializations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredRoadmaps.map((item) => (
                        <FoldCard
                            key={item.id}
                            accent={item.accent as any}
                            className={`group relative overflow-hidden flex flex-col min-h-[280px] transition-all duration-300 ${item.bg}`}
                        >
                            <div className="absolute top-0 right-0 p-4 border-l-4 border-b-4 border-white/20">
                                <item.icon className="size-10" />
                            </div>

                            <div className="mt-8 mb-4">
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                                    {item.title}
                                </h3>
                                <div className="w-16 h-2 bg-white/30 skew-x-[-12deg]" />
                            </div>

                            <p className="text-lg font-bold opacity-80 mb-8 flex-1 max-w-md">
                                {item.description}
                            </p>

                            <Link href={item.link} target="_blank" className="mt-auto">
                                <button className="h-12 px-8 bg-[#303134] text-[#E8EAED] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 border-4 border-black box-shadow-none">
                                    Launch Course <ArrowRight className="size-5" />
                                </button>
                            </Link>
                        </FoldCard>
                    ))}
                </div>
            </section>

            {/* DOMAIN TRACKS SECTION */}
            <section>
                <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-[#9AA0A6]">
                    Domain Tracks
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {domainRoadmaps.map((item) => (
                        <FoldCard
                            key={item.id}
                            accent="void"
                            className="group p-4 bg-[#303134] border-2 border-black hover:border-shatter-pink hover:translate-y-[-4px] transition-all"
                        >
                            <div className="flex flex-col h-full gap-4">
                                <div className="size-10 bg-black flex items-center justify-center border-2 border-black group-hover:bg-shatter-pink group-hover:text-white transition-colors text-white">
                                    <item.icon className="size-5" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-black uppercase leading-tight mb-1 group-hover:text-shatter-pink transition-colors text-[#E8EAED]">
                                        {item.title}
                                    </h3>
                                    <Link href={item.link} target="_blank" className="text-xs font-bold text-[#9AA0A6] uppercase flex items-center gap-1 hover:text-[#E8EAED]">
                                        View Track <ArrowRight className="size-3" />
                                    </Link>
                                </div>
                            </div>
                        </FoldCard>
                    ))}
                </div>
            </section>
        </div>
    );
}
