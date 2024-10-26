import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface GestureConfig {
    swipeThreshold?: number;
    rotationFactor?: number;
    scaleRange?: [number, number];
    hapticDuration?: number;
    hapticStrength?: number;
    velocityFactor?: number;
}

interface GestureHandlers {
    onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
    onRotate?: (angle: number) => void;
    onScale?: (scale: number) => void;
    onTap?: () => void;
    onLongPress?: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

const defaultConfig: GestureConfig = {
    swipeThreshold: 50,
    rotationFactor: 0.5,
    scaleRange: [0.95, 1.1],
    hapticDuration: 50,
    hapticStrength: 'medium',
    velocityFactor: 0.05
};

export const InteractiveElement: React.FC<{
    children: React.ReactNode;
    config?: GestureConfig;
    handlers?: GestureHandlers;
    className?: string;
}> = ({ children, config = {}, handlers = {}, className }) => {
    const settings = { ...defaultConfig, ...config };
    const elementRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const longPressTimer = useRef<NodeJS.Timeout>();

    // Motion values for smooth animations
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);
    const rotate = useMotionValue(0);

    // Transform rotation based on drag
    const rotateValue = useTransform(
        x,
        [-200, 200],
        [-settings.rotationFactor! * 30, settings.rotationFactor! * 30]
    );

    // Spring animation for smooth return
    const [{ springX, springY }, springApi] = useSpring(() => ({
        springX: 0,
        springY: 0,
        config: { tension: 300, friction: 20 }
    }));

    const triggerHaptic = (duration: number = settings.hapticDuration!, pattern?: number[]) => {
        if ('vibrate' in navigator) {
            if (pattern) {
                navigator.vibrate(pattern);
            } else {
                navigator.vibrate(duration);
            }
        }
    };

    // Gesture binding
    const bind = useDrag(
        ({ down, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], tap, time }) => {
            // Handle tap
            if (tap && handlers.onTap) {
                handlers.onTap();
                triggerHaptic(25);
            }

            // Handle drag
            if (down) {
                if (handlers.onDragStart && Math.abs(mx) > 5) {
                    handlers.onDragStart();
                }

                // Update position and rotation
                x.set(mx);
                y.set(my);
                rotate.set(rotateValue.get());
                scale.set(settings.scaleRange![1]);

                // Start long press timer
                if (!longPressTimer.current) {
                    longPressTimer.current = setTimeout(() => {
                        if (handlers.onLongPress) {
                            handlers.onLongPress();
                            triggerHaptic(50, [50, 30, 50]);
                        }
                    }, 500);
                }
            } else {
                // Clear long press timer
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = undefined;
                }

                // Handle swipe
                const swipeX = Math.abs(mx) > settings.swipeThreshold!;
                const swipeY = Math.abs(my) > settings.swipeThreshold!;
                const velocity = Math.sqrt(vx * vx + vy * vy);

                if (swipeX || swipeY) {
                    if (handlers.onSwipe) {
                        if (swipeX) {
                            handlers.onSwipe(dx > 0 ? 'right' : 'left');
                        } else {
                            handlers.onSwipe(dy > 0 ? 'down' : 'up');
                        }
                        triggerHaptic(25 + Math.min(velocity * 10, 50));
                    }
                }

                // Reset position with spring animation
                springApi.start({
                    springX: 0,
                    springY: 0,
                    config: {
                        velocity: Math.max(Math.abs(vx), Math.abs(vy)) * settings.velocityFactor!
                    }
                });

                // Reset scale and rotation
                controls.start({
                    scale: 1,
                    rotate: 0,
                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                });

                if (handlers.onDragEnd) {
                    handlers.onDragEnd();
                }
            }
        },
        {
            from: () => [x.get(), y.get()],
            filterTaps: true,
            bounds: { left: -200, right: 200, top: -200, bottom: 200 }
        }
    );

    return (
        <motion.div
            ref={elementRef}
            className={`interactive-element ${className || ''}`}
            style={{
                x: springX,
                y: springY,
                scale,
                rotate,
                touchAction: 'none'
            }}
            animate={controls}
            {...bind()}
        >
            {children}
        </motion.div>
    );
};
