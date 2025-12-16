'use client';

import { OrigamiNavbar } from '@/components/ui/origami/origami-navbar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code2, Cpu, Globe, Terminal, Smartphone, Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PolyCard } from '@/components/ui/origami/poly-card';
import { OrigamiTimeline } from '@/components/ui/origami/origami-timeline';
import { useSession } from 'next-auth/react';
import { OrigamiHero } from '@/components/ui/origami/origami-hero';
import { ShatterBackground } from '@/components/ui/shatter-background';

const events = [
  { title: 'Hacktoberfest', date: 'Oct', status: 'upcoming', type: 'Open Source' },
  { title: 'ICPC Prep', date: 'Nov', status: 'upcoming', type: 'CP' },
  { title: 'Winter of Code', date: 'Dec', status: 'upcoming', type: 'Mentorship' },
  { title: 'Code Wars', date: 'Jan', status: 'upcoming', type: 'CP' },
  { title: 'FaceOff', date: 'Feb', status: 'upcoming', type: 'CP 1v1' },
  { title: 'Summer of Code', date: 'May', status: 'upcoming', type: 'Mentorship' },
];

const domains = [
  { name: 'Web Dev', icon: Globe },
  { name: 'App Dev', icon: Smartphone },
  { name: 'AI/ML', icon: Brain },
  { name: 'CP / DSA', icon: Code2 },
  { name: 'Game Dev', icon: Cpu },
  { name: 'Cyber Sec', icon: Terminal },
];

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-[#202124] text-[#E8EAED] selection:bg-shatter-yellow selection:text-black overflow-x-hidden font-sans">
      <OrigamiNavbar />

      {/* ORIGAMI HERO SECTION */}
      <OrigamiHero />

      {/* Vertical Timeline Section */}
      <section className="py-24 relative z-10 bg-[#202124]" id="timeline">
        {/* Subtle Background Animation for Timeline Section */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
          <ShatterBackground />
        </div>

        <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-[#E8EAED]"
          >
            The <span className="text-shatter-pink">Journey</span>
          </motion.h2>
          <p className="text-[#9AA0A6] font-bold uppercase tracking-widest max-w-xl mx-auto">
            From major hackathons to intimate mentorship sessions, here is what lies ahead.
          </p>
        </div>

        <div className="relative z-10">
          <OrigamiTimeline events={events} />
        </div>
      </section>

      {/* Technologies Spotlight Grid */}
      <section className="py-32 max-w-7xl mx-auto px-4 relative z-10" id="tech-stack">
        <div className="text-center mb-20 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none"
          >
            Master The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8EAED] via-[#E8EAED] to-[#9AA0A6]">Stack</span>
            <span className="text-shatter-blue inline-block w-4 h-4 bg-shatter-yellow ml-2 skew-x-[-12deg]" />
          </motion.h2>
          <p className="text-[#9AA0A6] font-bold text-lg max-w-2xl mx-auto uppercase tracking-wide">
            We don't chase trends. We build on foundations using industry-standard technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10 px-4 md:px-0">
          {domains.map((domain, i) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <PolyCard className="size-40 hover:scale-110 active:scale-95 transition-transform duration-200 cursor-default">
                  <Icon className={cn("size-12 mb-4 transition-colors duration-300 text-[#E8EAED] group-hover:text-[#E8EAED]")} />
                  <span className="font-black text-[#E8EAED] uppercase tracking-tight group-hover:text-[#E8EAED] transition-colors">{domain.name}</span>
                </PolyCard>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
