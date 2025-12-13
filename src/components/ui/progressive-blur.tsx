import { cn } from '@/lib/utils';

interface ProgressiveBlurProps {
    className?: string;
    direction?: 'left' | 'right' | 'top' | 'bottom';
    blurIntensity?: number; // 1 to 10 maybe? or just generic
}

export const ProgressiveBlur = ({ className, direction = 'left', blurIntensity = 1 }: ProgressiveBlurProps) => {
    // Map direction to mask-image gradient
    const getMask = () => {
        switch (direction) {
            case 'left': return 'linear-gradient(to right, black, transparent)';
            case 'right': return 'linear-gradient(to left, black, transparent)';
            case 'top': return 'linear-gradient(to bottom, black, transparent)';
            case 'bottom': return 'linear-gradient(to top, black, transparent)';
            default: return 'linear-gradient(to right, black, transparent)';
        }
    };

    // Map intensity to tailwind blur class approximation
    const getBlurClass = () => {
        if (blurIntensity >= 3) return 'backdrop-blur-xl';
        if (blurIntensity >= 2) return 'backdrop-blur-lg';
        return 'backdrop-blur-md';
    };

    return (
        <div
            className={cn('absolute z-10 pointer-events-none', getBlurClass(), className)}
            style={{
                maskImage: getMask(),
                WebkitMaskImage: getMask(),
            }}
        />
    );
};
