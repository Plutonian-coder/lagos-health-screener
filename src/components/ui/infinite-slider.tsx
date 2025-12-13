'use client';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, animate } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';

export const InfiniteSlider = ({
    children,
    gap = 16,
    speed = 100,
    speedOnHover,
    direction = 'horizontal',
    className,
}: {
    children: React.ReactNode;
    gap?: number;
    speed?: number;
    speedOnHover?: number;
    direction?: 'horizontal' | 'vertical';
    className?: string;
}) => {
    const [ref, { width, height }] = useMeasure();
    const translation = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        let controls;
        const finalSpeed = isHovered && speedOnHover ? speedOnHover : speed;
        const size = direction === 'horizontal' ? width : height;
        const contentSize = size / 2; // We double the content

        if (contentSize > 0) {
            controls = animate(translation, [0, -contentSize], {
                ease: 'linear',
                duration: contentSize / finalSpeed,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0,
                onUpdate: (latest) => {
                    if (mustFinish) {
                        // Logic to seamlessly stop or change speed
                    }
                }
            });
        }

        return () => controls?.stop();
    }, [width, height, speed, speedOnHover, isHovered, direction, translation]);

    return (
        <div
            className={cn('relative overflow-hidden', className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                ref={ref}
                style={{
                    x: direction === 'horizontal' ? translation : 0,
                    y: direction === 'vertical' ? translation : 0,
                }}
                className={cn('flex', direction === 'vertical' && 'flex-col')}
            >
                <div style={{ gap: `${gap}px` }} className={cn("flex shrink-0", direction === 'vertical' && 'flex-col')}>
                    {children}
                </div>
                <div style={{ gap: `${gap}px` }} className={cn("flex shrink-0", direction === 'vertical' && 'flex-col')}>
                    {children}
                </div>
                <div style={{ gap: `${gap}px` }} className={cn("flex shrink-0", direction === 'vertical' && 'flex-col')}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
