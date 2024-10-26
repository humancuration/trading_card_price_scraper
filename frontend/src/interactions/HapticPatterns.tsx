import { useEffect, useRef } from 'react';

interface HapticPattern {
    pattern: number[];
    intensity: number;
    variation: number; // Amount of random variation allowed
}

export const hapticPatterns = {
    // Basic patterns
    soft: { pattern: [10], intensity: 0.3, variation: 0.1 },
    medium: { pattern: [30], intensity: 0.5, variation: 0.2 },
    hard: { pattern: [50], intensity: 0.8, variation: 0.2 },

    // Card type patterns
    common: { pattern: [20, 10], intensity: 0.3, variation: 0.1 },
    uncommon: { pattern: [30, 20, 30], intensity: 0.5, variation: 0.15 },
    rare: { pattern: [40, 20, 40, 20], intensity: 0.7, variation: 0.2 },
    ultraRare: { pattern: [50, 30, 80, 30, 50], intensity: 0.9, variation: 0.25 },
    secret: { pattern: [100, 50, 100, 50, 100, 50, 100], intensity: 1, variation: 0.3 },

    // Value-based patterns (can be combined with card types)
    lowValue: { pattern: [10, 5, 10], intensity: 0.2, variation: 0.1 },
    mediumValue: { pattern: [30, 15, 30], intensity: 0.5, variation: 0.2 },
    highValue: { pattern: [50, 25, 50, 25, 50], intensity: 0.8, variation: 0.3 },
    jackpot: { pattern: [100, 50, 100, 50, 100, 50, 100], intensity: 1, variation: 0.4 },

    // Special combinations
    holoRare: { pattern: [40, 20, 60, 20, 40], intensity: 0.8, variation: 0.2 },
    firstEdition: { pattern: [60, 30, 90, 30, 60], intensity: 0.9, variation: 0.25 },
    vintageMint: { pattern: [80, 40, 120, 40, 80], intensity: 1, variation: 0.3 },
};

export const useEnhancedHaptics = () => {
    const lastTriggerTime = useRef(0);
    const currentCombo = useRef(0);

    const addRandomVariation = (pattern: number[], variation: number): number[] => {
        return pattern.map(duration => {
            const variationAmount = duration * variation;
            return duration + (Math.random() * variationAmount * 2 - variationAmount);
        });
    };

    const combinePatterns = (patterns: HapticPattern[]): number[] => {
        const combined = patterns.reduce((acc, curr) => {
            const varied = addRandomVariation(curr.pattern, curr.variation);
            return acc.concat(varied.map(v => v * curr.intensity));
        }, [] as number[]);
        return combined;
    };

    const trigger = (
        mainPattern: keyof typeof hapticPatterns,
        options?: {
            value?: number;
            additionalPatterns?: (keyof typeof hapticPatterns)[];
            comboMultiplier?: boolean;
        }
    ) => {
        if (!navigator.vibrate) return;

        const now = Date.now();
        if (now - lastTriggerTime.current < 1000) {
            currentCombo.current++;
        } else {
            currentCombo.current = 0;
        }
        lastTriggerTime.current = now;

        const patterns: HapticPattern[] = [hapticPatterns[mainPattern]];

        // Add value-based pattern
        if (options?.value) {
            if (options.value >= 1000) patterns.push(hapticPatterns.jackpot);
            else if (options.value >= 500) patterns.push(hapticPatterns.highValue);
            else if (options.value >= 100) patterns.push(hapticPatterns.mediumValue);
            else patterns.push(hapticPatterns.lowValue);
        }

        // Add additional patterns
        options?.additionalPatterns?.forEach(p => patterns.push(hapticPatterns[p]));

        // Apply combo multiplier
        if (options?.comboMultiplier && currentCombo.current > 0) {
            const comboIntensity = Math.min(currentCombo.current * 0.2 + 1, 2);
            patterns.forEach(p => p.intensity *= comboIntensity);
        }

        const finalPattern = combinePatterns(patterns);
        navigator.vibrate(finalPattern);
    };

    return { trigger, patterns: hapticPatterns };
};
