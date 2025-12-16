'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FoldCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    accent?: 'flame' | 'blue' | 'void';
}

export function FoldCard({ className, children, accent = 'void', ...props }: FoldCardProps) {
    // Mapping generic accent names to Shatter Palette
    const accents = {
        flame: 'hover:border-shatter-pink', // was orange, now pink
        blue: 'hover:border-shatter-yellow', // was blue, now yellow
        void: 'hover:border-black'
    };

    return (
        <div
            className={cn(
                "relative bg-[#303134] text-[#E8EAED] p-6 transition-all duration-200 group",
                "border-4 border-black",
                "shatter-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_var(--color-shatter-pink)]",
                accents[accent],
                className
            )}
            style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' // Subtle bottom-right cut
            }}
            {...props}
        >
            {/* Decorative colored strip on top */}
            <div className={cn(
                "absolute top-0 left-0 w-full h-2 border-b-2 border-black",
                accent === 'flame' ? 'bg-shatter-pink' :
                    accent === 'blue' ? 'bg-shatter-yellow' : 'bg-black'
            )} />

            {children}
        </div>
    );
}
