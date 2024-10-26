import { motion, AnimationProps, Variants } from 'framer-motion';
import React from 'react';

interface AnimationLayer {
    type: 'entrance' | 'hover' | 'exit' | 'interaction';
    variants: Variants;
    timing: number;
    ease: string;
}

// Base animations that can be combined
const baseAnimations: Record<string, AnimationLayer> = {
    float: {
        type: 'hover',
        variants: {
            initial: { y: 0 },
            animate: { y: [-5, 5, -5], transition: { repeat: Infinity, duration: 3 } }
        },
        timing: 0.3,
        ease: 'easeInOut'
    },
    glow: {
        type: 'hover',
        variants: {
            initial: { filter: 'brightness(1)' },
            animate: { filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }
        },
        timing: 0.5,
        ease: 'linear'
    },
    flip: {
        type: 'interaction',
        variants: {
            initial: { rotateY: 0 },
            animate: { rotateY: 180 }
        },
        timing: 0.6,
        ease: 'backOut'
    },
    shimmer: {
        type: 'hover',
        variants: {
            initial: { backgroundPosition: '200% 0' },
            animate: { backgroundPosition: ['-200% 0', '200% 0'] }
        },
        timing: 3,
        ease: 'linear'
    }
};

// Card game specific animations
const cardAnimations: Record<string, AnimationLayer[]> = {
    mythicReveal: [
        baseAnimations.float,
        {
            type: 'entrance',
            variants: {
                initial: { scale: 0.8, opacity: 0 },
                animate: { 
                    scale: 1.1, 
                    opacity: 1,
                    filter: [
                        'brightness(1) blur(0px)',
                        'brightness(2) blur(4px)',
                        'brightness(1) blur(0px)'
                    ]
                }
            },
            timing: 1.2,
            ease: 'easeOut'
        }
    ],
    packOpening: [
        {
            type: 'interaction',
            variants: {
                initial: { scale: 1, y: 0 },
                animate: { 
                    scale: [1, 1.1, 1],
                    y: [0, -30, 0],
                    transition: {
                        times: [0, 0.5, 1],
                        duration: 1.5
                    }
                }
            },
            timing: 1.5,
            ease: 'easeInOut'
        }
    ]
};

interface AnimatedCardProps {
    children: React.ReactNode;
    animations: string[];
    isInteractive?: boolean;
    onAnimationComplete?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    animations,
    isInteractive = true,
    onAnimationComplete,
    className,
    style
}) => {
    const combinedVariants = animations.reduce((acc, animName) => {
        const cardAnim = cardAnimations[animName] || [baseAnimations[animName]];
        cardAnim.forEach(layer => {
            Object.entries(layer.variants).forEach(([key, value]) => {
                acc[key] = { ...acc[key], ...value };
            });
        });
        return acc;
    }, {} as Variants);

    return (
        <motion.div
            className={`animated-card ${className || ''}`}
            variants={combinedVariants}
            initial="initial"
            animate="animate"
            whileHover={isInteractive ? "hover" : undefined}
            style={{
                perspective: 1000,
                ...style
            }}
            onAnimationComplete={onAnimationComplete}
        >
            {children}
        </motion.div>
    );
};
