import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

interface ValueDisplayProps {
    value: number;
    totalValue: number;
    isRevealing: boolean;
}

export const ValueDisplay: React.FC<ValueDisplayProps> = ({ value, totalValue, isRevealing }) => {
    const [hue, setHue] = useState(0);
    const [scale, setScale] = useState(1);

    // Animated number display
    const { number: displayValue } = useSpring({
        from: { number: 0 },
        number: value,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    const { number: displayTotal } = useSpring({
        from: { number: totalValue - value },
        number: totalValue,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    // Calculate color based on value
    useEffect(() => {
        let newHue = 0;
        if (value >= 1000) newHue = 300; // Purple
        else if (value >= 500) newHue = 240; // Blue
        else if (value >= 100) newHue = 120; // Green
        else if (value >= 50) newHue = 60; // Yellow
        else newHue = 0; // Red

        setHue(newHue);
        setScale(1 + Math.min(value / 1000, 1));
    }, [value]);

    return (
        <div className="value-display-container">
            <AnimatePresence>
                {isRevealing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="current-value"
                    >
                        <animated.span
                            style={{
                                color: `hsl(${hue}, 100%, 50%)`,
                                transform: `scale(${scale})`,
                                textShadow: `0 0 10px hsla(${hue}, 100%, 50%, 0.5)`,
                            }}
                        >
                            ${displayValue.to(n => n.toFixed(2))}
                        </animated.span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="total-value">
                Total Value: 
                <animated.span
                    style={{
                        color: totalValue >= 1000 ? '#ff00ff' : '#2196f3',
                        fontWeight: 'bold',
                    }}
                >
                    ${displayTotal.to(n => n.toFixed(2))}
                </animated.span>
            </div>
        </div>
    );
};
