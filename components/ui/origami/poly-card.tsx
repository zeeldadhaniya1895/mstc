'use client';

import { cn } from "@/lib/utils";

interface PolyCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function PolyCard({ className, children, ...props }: PolyCardProps) {
    return (
        <div
            className={cn(
                "relative bg-[#303134] group transition-all duration-300 text-[#E8EAED]",
                className
            )}
            style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            }}
            {...props}
        >
            {/* Inner Border Simulation */}
            <div className="absolute inset-[3px] bg-[#303134] -z-10 group-hover:bg-shatter-yellow transition-colors"
                style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                }}
            />

            {/* Outer Border (Background Layer) */}
            <div className="absolute inset-0 bg-black -z-20" />

            <div className="h-full w-full flex flex-col items-center justify-center p-5 text-center z-10 relative">
                {children}
            </div>
        </div>
    );
}
