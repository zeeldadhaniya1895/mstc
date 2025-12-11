'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function MagneticButton({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { mass: 0.1, stiffness: 150, damping: 15 });
    const ySpring = useSpring(y, { mass: 0.1, stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        if (Math.abs(distanceX) < width && Math.abs(distanceY) < height) {
            x.set(distanceX * 0.3);
            y.set(distanceY * 0.3);
        } else {
            x.set(0);
            y.set(0);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
