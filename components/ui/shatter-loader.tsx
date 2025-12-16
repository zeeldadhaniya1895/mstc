'use client';

import { motion } from 'framer-motion';

export function ShatterLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="relative size-24">
                {/* Central Square - Black */}
                <motion.div
                    className="absolute inset-4 bg-black border-2 border-white"
                    animate={{
                        rotate: [0, 90, 180, 270, 360],
                        scale: [1, 0.8, 1, 0.8, 1]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        times: [0, 0.2, 0.5, 0.8, 1]
                    }}
                />

                {/* Orbiting Shard - Yellow */}
                <motion.div
                    className="absolute top-0 left-0 size-8 bg-shatter-yellow border-2 border-black"
                    animate={{
                        x: [0, 64, 64, 0, 0],
                        y: [0, 0, 64, 64, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />

                {/* Orbiting Shard - Pink (Counter Rotate) */}
                <motion.div
                    className="absolute bottom-0 right-0 size-6 bg-shatter-pink border-2 border-black"
                    animate={{
                        x: [0, -64, -64, 0, 0],
                        y: [0, 0, -64, -64, 0],
                        rotate: [0, -180, -360]
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />
            </div>

            <div className="text-center">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#E8EAED] animate-pulse">
                    LOADING <span className="text-shatter-yellow">_</span>
                </h2>
                <p className="font-mono font-bold text-[#9AA0A6] text-xs tracking-[0.2em] mt-2">
                    INITIALIZING SYSTEM
                </p>
            </div>
        </div>
    );
}
