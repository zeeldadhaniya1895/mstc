'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function ShatterBackground() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,212,0,0.05),transparent_70%)]" />

            {/* Floating Shards */}
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "absolute opacity-20",
                        i % 3 === 0 ? "bg-shatter-yellow" :
                            i % 3 === 1 ? "bg-shatter-pink" : "bg-black"
                    )}
                    initial={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        scale: 0,
                        rotate: 0
                    }}
                    animate={{
                        y: [0, Math.random() * 100 - 50],
                        x: [0, Math.random() * 100 - 50],
                        rotate: [0, 180, 360],
                        scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                    style={{
                        width: Math.random() * 100 + 50, // Bigger shards
                        height: Math.random() * 100 + 50,
                        clipPath: i % 2 === 0
                            ? 'polygon(50% 0%, 0% 100%, 100% 100%)' // Triangle
                            : 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' // Octagon-ish
                    }}
                />
            ))}
        </div>
    );
}
