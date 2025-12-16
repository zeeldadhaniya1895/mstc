'use client';

import { motion } from 'framer-motion';

export function OrigamiLoader() {
    return (
        <div className="fixed inset-0 z-[100] bg-[#0F0F12] flex items-center justify-center">
            <div className="relative size-24">
                {/* Square 1: Top Left */}
                <motion.div
                    className="absolute top-0 left-0 w-12 h-12 bg-origami-flame"
                    animate={{
                        rotateX: [0, 180, 180, 0],
                        opacity: [1, 0.5, 0.5, 1],
                        zIndex: [1, 0, 0, 1]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        times: [0, 0.25, 0.5, 0.75]
                    }}
                    style={{ originY: 1 }}
                />

                {/* Square 2: Top Right */}
                <motion.div
                    className="absolute top-0 right-0 w-12 h-12 bg-origami-blue"
                    animate={{
                        rotateY: [0, 0, 180, 180],
                        opacity: [1, 1, 0.5, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        times: [0, 0.25, 0.5, 0.75]
                    }}
                    style={{ originX: 0 }}
                />

                {/* Square 3: Bottom Left - Static anchor */}
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10" />

                {/* Square 4: Bottom Right - Delayed fold */}
                <motion.div
                    className="absolute bottom-0 right-0 w-12 h-12 bg-white"
                    animate={{
                        rotateX: [0, 0, 0, -180],
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        times: [0, 0.25, 0.5, 0.75]
                    }}
                    style={{ originY: 0 }}
                />
            </div>

            <motion.p
                className="absolute mt-32 font-mono text-xs tracking-[0.5em] text-white/50 uppercase"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Loading_Assets
            </motion.p>
        </div>
    );
}
