import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleEffect } from './ParticleSystem';
import { CardEffect } from '../types';
import { extendedRevealSequences, chainEffects } from '../theme/CardRevealSequences';

export class EffectManager {
    private static instance: EffectManager;
    private activeEffects: Map<string, CardEffect>;
    private audioContext: AudioContext;

    private constructor() {
        this.activeEffects = new Map();
        this.audioContext = new AudioContext();
    }

    static getInstance(): EffectManager {
        if (!EffectManager.instance) {
            EffectManager.instance = new EffectManager();
        }
        return EffectManager.instance;
    }

    async playSound(soundFile: string): Promise<void> {
        const response = await fetch(soundFile);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    triggerHaptic(pattern: number[]): void {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    async playEffectSequence(sequenceName: string): Promise<void> {
        const sequence = extendedRevealSequences[sequenceName];
        if (!sequence) return;

        // Pre-reveal effect
        if (sequence?.effects?.preReveal) {
            this.addEffect(sequence.effects.preReveal, { intensity: 0.5 });
        }
        await this.delay(sequence.preDelay * 1000);

        // Main effect
        if (sequence?.effects?.mainEffect) {
            this.addEffect(sequence.effects.mainEffect, { intensity: 1 });
        }
        this.triggerHaptic(sequence.hapticPattern);
        
        // Play sound sequence
        for (const sound of sequence.effects?.sound ?? []) {
            await this.playSound(`/sounds/${sound}.mp3`);
        }

        await this.delay(sequence.flipDuration * 1000);

        // Post-reveal effect
        if (sequence?.effects?.postReveal) {
            this.addEffect(sequence.effects.postReveal, { intensity: 0.7 });
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addEffect(type: string, config: any = {}): void {
        this.activeEffects.set(type, { type, ...config });
    }

    removeEffect(type: string): void {
        this.activeEffects.delete(type);
    }

    clearEffects(): void {
        this.activeEffects.clear();
    }

    // Add this getter
    public getActiveEffects(): CardEffect[] {
        return Array.from(this.activeEffects.values());
    }
}

export const EffectRenderer: React.FC = () => {
    const effectManager = EffectManager.getInstance();
    const effects = effectManager.getActiveEffects();

    return (
        <div className="effect-container">
            <Canvas>
                {effects.map((effect, index) => (
                    <ParticleEffect 
                        key={`${effect.type}-${index}`}
                        {...effect} 
                        count={effect.config?.count ?? 100}
                        color={effect.config?.color ?? '#ffffff'}
                        size={effect.config?.size ?? 2}
                        speed={effect.config?.speed ?? 1}
                        spread={effect.config?.spread ?? 50}
                    />
                ))}
            </Canvas>
        </div>
    );
};
