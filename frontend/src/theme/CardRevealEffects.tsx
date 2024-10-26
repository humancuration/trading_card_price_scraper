import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Add 'export' keyword to make the interface available to other modules
export interface RevealSequence {
    preDelay: number;
    flipDuration: number;
    glowDelay: number;
    particleDelay: number;
    soundDelay: number;
    hapticPattern: number[];
    effects?: {
        preReveal?: string;
        mainEffect?: string;
        postReveal?: string;
        ambient?: string;
        sound?: string[];
    };
}

const revealSequences: Record<string, RevealSequence> = {
    mythic: {
        preDelay: 0.5,
        flipDuration: 1.2,
        glowDelay: 0.8,
        particleDelay: 0.6,
        soundDelay: 0.3,
        hapticPattern: [100, 50, 100, 200, 300] // ms vibration pattern
    },
    ultraRare: {
        preDelay: 0.3,
        flipDuration: 1.0,
        glowDelay: 0.6,
        particleDelay: 0.4,
        soundDelay: 0.2,
        hapticPattern: [50, 30, 100, 150]
    },
    rare: {
        preDelay: 0.2,
        flipDuration: 0.8,
        glowDelay: 0.4,
        particleDelay: 0.3,
        soundDelay: 0.1,
        hapticPattern: [30, 20, 50]
    }
};

const useHapticFeedback = (pattern: number[]) => {
    return () => {
        if (!navigator.vibrate) return;
        
        navigator.vibrate(pattern);
    };
};

const CardRevealAnimation: React.FC<{ rarity: string; onComplete: () => void }> = ({ 
    rarity, 
    onComplete 
}) => {
    const controls = useAnimation();
    const sequence = revealSequences[rarity];
    const triggerHaptic = useHapticFeedback(sequence.hapticPattern);
    
    const [springs, api] = useSpring(() => ({
        rotateY: 0,
        scale: 1,
        config: {
            tension: 150,
            friction: 20,
            mass: 1
        }
    }));

    const orchestrateReveal = async () => {
        // Pre-reveal anticipation
        await controls.start({
            scale: [1, 1.05, 1],
            transition: { duration: sequence.preDelay }
        });

        // Trigger haptic
        triggerHaptic();

        // Start flip
        api.start({
            rotateY: 180,
            config: {
                ...config.wobbly,
                duration: sequence.flipDuration * 1000
            }
        });

        // Glow effect
        await controls.start({
            boxShadow: [
                "0 0 0 rgba(255,255,255,0)",
                "0 0 30px rgba(255,215,0,0.8)",
                "0 0 10px rgba(255,215,0,0.3)"
            ],
            transition: { 
                delay: sequence.glowDelay,
                duration: 0.5 
            }
        });

        // Particle burst
        await controls.start({
            scale: [1, 1.1, 1],
            transition: { 
                delay: sequence.particleDelay,
                duration: 0.3
            }
        });

        onComplete();
    };

    return (
        <motion.div
            animate={controls}
            className={`card-reveal ${rarity}`}
            onClick={orchestrateReveal}
        >
            <animated.div
                style={{
                    ...springs,
                    transform: springs.rotateY.to(
                        r => `perspective(1500px) rotateY(${r}deg)`
                    )
                }}
            >
                {/* Card content */}
            </animated.div>
        </motion.div>
    );
};

// Sound effect manager
const useSoundEffects = (rarity: string) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const sounds = {
        mythic: [
            '/sounds/mythic-whoosh.mp3',
            '/sounds/mythic-reveal.mp3',
            '/sounds/mythic-sparkle.mp3'
        ],
        ultraRare: [
            '/sounds/ultra-whoosh.mp3',
            '/sounds/ultra-reveal.mp3'
        ],
        rare: [
            '/sounds/rare-whoosh.mp3',
            '/sounds/rare-reveal.mp3'
        ]
    };

    const playSequence = async () => {
        const sequence = sounds[rarity as keyof typeof sounds];
        for (const sound of sequence) {
            if (audioRef.current) {
                audioRef.current.src = sound;
                await audioRef.current.play();
                await new Promise(resolve => 
                    setTimeout(resolve, audioRef.current?.duration || 0)
                );
            }
        }
    };

    return { audioRef, playSequence };
};

// Physics-based particle system
const ParticleBurst: React.FC<{ intensity: number }> = ({ intensity }) => {
    const particles = useRef<THREE.Points>(null);

    useFrame(({ clock }) => {
        if (!particles.current) return;

        const positions = particles.current.geometry.attributes.position.array;
        const time = clock.getElapsedTime();

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            // Add physics-based movement
            positions[i] = x + Math.sin(time + x) * 0.01 * intensity;
            positions[i + 1] = y + Math.cos(time + y) * 0.01 * intensity;
            positions[i + 2] = z + Math.sin(time + z) * 0.01 * intensity;
        }

        particles.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particles}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={1000 * intensity}
                    array={new Float32Array(3000 * intensity).map(() => 
                        (Math.random() - 0.5) * 10
                    )}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color={0xffd700}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};
