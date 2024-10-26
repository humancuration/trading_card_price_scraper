export interface RevealSequence {
    preDelay: number;
    flipDuration: number;
    glowDelay: number;
    particleDelay: number;
    soundDelay: number;
    hapticPattern: number[];
    effects: {
        preReveal: string;
        mainEffect: string;
        postReveal: string;
        ambient: string;
        sound: string[];
    };
}

export interface CardEffect {
    type: string;
    intensity: number;
    config?: any;
}

export interface ParticleConfig {
    count: number;
    color: string;
    size: number;
    speed: number;
    spread: number;
}

export interface ThemeEffectProps {
    type: string;
    intensity?: number;
    config?: any;
}
