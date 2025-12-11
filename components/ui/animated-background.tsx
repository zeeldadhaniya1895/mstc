'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
            <div className="bg-noise" />

            {/* Deep Space Gradients */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15],
                    rotate: [0, 45, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-neon-cyan/20 rounded-full blur-[150px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, 100, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute top-[20%] right-[-20%] w-[70vw] h-[70vw] bg-neon-purple/20 rounded-full blur-[180px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute bottom-[-20%] left-[20%] w-[90vw] h-[90vw] bg-neon-pink/15 rounded-full blur-[200px] mix-blend-screen"
            />
        </div>
    );
}
