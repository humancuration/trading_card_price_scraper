import { RevealSequence } from './CardRevealEffects';

// Extended reveal sequences with more dramatic effects
export const extendedRevealSequences: Record<string, RevealSequence> = {
    mythicRainbow: {
        preDelay: 0.8,
        flipDuration: 1.5,
        glowDelay: 0.6,
        particleDelay: 0.4,
        soundDelay: 0.2,
        hapticPattern: [100, 50, 100, 200, 300, 400],
        effects: {
            preReveal: 'rainbow-shimmer',
            mainEffect: 'prismatic-burst',
            postReveal: 'floating-sparkles',
            ambient: 'mythic-aura',
            sound: ['whoosh-mystical', 'crystal-shine', 'mythic-chorus']
        }
    },
    secretRare: {
        preDelay: 0.6,
        flipDuration: 1.3,
        glowDelay: 0.5,
        particleDelay: 0.3,
        soundDelay: 0.15,
        hapticPattern: [80, 40, 120, 250],
        effects: {
            preReveal: 'golden-rays',
            mainEffect: 'stardust-explosion',
            postReveal: 'orbital-sparkles',
            ambient: 'rare-glow',
            sound: ['magical-build', 'star-burst', 'heavenly-chord']
        }
    },
    fullArtRare: {
        preDelay: 0.5,
        flipDuration: 1.2,
        glowDelay: 0.4,
        particleDelay: 0.25,
        soundDelay: 0.1,
        hapticPattern: [60, 30, 90, 180],
        effects: {
            preReveal: 'art-lines',
            mainEffect: 'paint-splash',
            postReveal: 'floating-frames',
            ambient: 'artistic-glow',
            sound: ['brush-swoosh', 'canvas-pop', 'art-flourish']
        }
    },
    holographic: {
        preDelay: 0.4,
        flipDuration: 1.0,
        glowDelay: 0.3,
        particleDelay: 0.2,
        soundDelay: 0.1,
        hapticPattern: [50, 25, 75, 150],
        effects: {
            preReveal: 'holo-ripple',
            mainEffect: 'rainbow-wave',
            postReveal: 'light-scatter',
            ambient: 'holo-shine',
            sound: ['foil-crinkle', 'light-chime', 'sparkle-fade']
        }
    },
    elementalRare: {
        preDelay: 0.5,
        flipDuration: 1.1,
        glowDelay: 0.4,
        particleDelay: 0.3,
        soundDelay: 0.15,
        hapticPattern: [70, 35, 100, 200],
        effects: {
            preReveal: 'elemental-surge',
            mainEffect: 'element-burst',
            postReveal: 'elemental-orbit',
            ambient: 'element-aura',
            sound: ['element-rise', 'power-surge', 'elemental-chord']
        }
    },
    ancientRare: {
        preDelay: 0.7,
        flipDuration: 1.4,
        glowDelay: 0.5,
        particleDelay: 0.35,
        soundDelay: 0.2,
        hapticPattern: [90, 45, 110, 220, 330],
        effects: {
            preReveal: 'ancient-runes',
            mainEffect: 'time-ripple',
            postReveal: 'floating-glyphs',
            ambient: 'ancient-aura',
            sound: ['deep-resonance', 'time-shift', 'ancient-power']
        }
    },
    prismRare: {
        preDelay: 0.5,
        flipDuration: 1.2,
        glowDelay: 0.4,
        particleDelay: 0.3,
        soundDelay: 0.15,
        hapticPattern: [60, 30, 90, 180, 270],
        effects: {
            preReveal: 'prism-shatter',
            mainEffect: 'crystal-formation',
            postReveal: 'light-refraction',
            ambient: 'prism-glow',
            sound: ['crystal-form', 'prism-shine', 'light-cascade']
        }
    }
};

// Special effect combinations for chain reactions
export const chainEffects = {
    multiReveal: {
        timing: {
            stagger: 0.2,
            overlap: 0.5,
            finalDelay: 1.0
        },
        effects: {
            connector: 'energy-stream',
            buildup: 'power-accumulation',
            climax: 'massive-burst'
        },
        sound: {
            ambient: 'rising-tension',
            peak: 'power-release',
            fade: 'energy-dissipate'
        }
    },
    rarityEscalation: {
        timing: {
            baseDelay: 0.3,
            escalationRate: 1.2,
            peakDuration: 0.8
        },
        effects: {
            progression: 'increasing-particles',
            transition: 'rarity-shift',
            peak: 'maximum-brilliance'
        },
        sound: {
            build: 'ascending-tones',
            transition: 'pitch-shift',
            climax: 'harmonic-convergence'
        }
    }
};

// Interactive effect triggers
export const interactiveEffects = {
    hover: {
        entry: 'card-lift',
        active: 'hover-glow',
        exit: 'smooth-descent'
    },
    touch: {
        start: 'ripple-out',
        hold: 'energy-gather',
        release: 'power-disperse'
    },
    gesture: {
        swipe: 'trail-effect',
        rotate: 'perspective-shift',
        pinch: 'zoom-burst'
    }
};

// Environmental effects that respond to card rarity
export const environmentalEffects = {
    background: {
        mythic: 'reality-distortion',
        ultraRare: 'star-field',
        rare: 'gentle-waves'
    },
    lighting: {
        mythic: 'divine-rays',
        ultraRare: 'spotlight-focus',
        rare: 'soft-bloom'
    },
    particles: {
        mythic: 'reality-fragments',
        ultraRare: 'stardust',
        rare: 'light-motes'
    }
};
