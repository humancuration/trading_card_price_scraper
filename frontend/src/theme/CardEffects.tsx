import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls } from '@react-three/drei';
import { createParticleSystem, ParticleEffect } from '../effects/ParticleSystem';
import type { ParticleConfig } from '../types';
import { GLTF } from 'three-stdlib';

interface GLTFResult extends GLTF {
    nodes: {
        // Define the specific mesh names from your card.glb model
        [key: string]: THREE.Mesh
    };
    materials: {
        // Define materials if needed
        [key: string]: THREE.Material
    };
}

interface CardRarityEffect {
    threshold: number;
    effects: {
        glow: string;
        particles: {
            count: number;
            spread: number;
            speed: number;
            size: number;
            color: string;
        };
        sound: string;
        animation: string;
        aura: string;
    };
}

const rarityEffects: CardRarityEffect[] = [
    {
        threshold: 1000,  // Ultra Rare / High Value
        effects: {
            glow: 'rainbow-prismatic',
            particles: {
                count: 1000,
                spread: 50,
                speed: 0.5,
                size: 0.1,
                color: '#ffffff'
            },
            sound: '/sounds/mythic-reveal.mp3',
            animation: 'mythic-float',
            aura: 'legendary-flames'
        }
    },
    {
        threshold: 500,  // Super Rare
        effects: {
            glow: 'golden-shine',
            particles: {
                count: 500,
                spread: 30,
                speed: 1,
                size: 0.2,
                color: '#ffaa00'
            },
            sound: '/sounds/rare-reveal.mp3',
            animation: 'rare-spin',
            aura: 'rare-glow'
        }
    },
    {
        threshold: 100,  // Rare
        effects: {
            glow: 'blue-essence',
            particles: {
                count: 300,
                spread: 20,
                speed: 0.3,
                size: 0.05,
                color: '#4444ff'
            },
            sound: '/sounds/uncommon-reveal.mp3',
            animation: 'hover',
            aura: 'blue-mist'
        }
    }
];

interface Card3DModel {
    geometry: THREE.BufferGeometry;
    materials: THREE.Material[];
}

const Card3D: React.FC<{ model: GLTFResult, rarity: number }> = ({ model, rarity }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const rarityEffect = rarityEffects.find(effect => rarity >= effect.threshold);

    useFrame(({ clock }) => {
        if (meshRef.current && rarityEffect) {
            meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
            if (rarity > 500) {
                meshRef.current.rotation.y += 0.01;
            }
        }
    });

    return (
        <primitive object={(model as GLTF).scene} ref={meshRef} />
    );
};

interface CardRevealProps {
    cardImage: string;
    cardName: string;
    marketPrice: number;
    onRevealComplete?: () => void;
}

export const CardReveal: React.FC<CardRevealProps> = ({
    cardImage,
    cardName,
    marketPrice,
    onRevealComplete
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const rarityEffect = rarityEffects.find(effect => marketPrice >= effect.threshold);

    const [flipped, setFlipped] = useState(false);
    const { transform, opacity } = useSpring({
        transform: `perspective(1500px) rotateY(${flipped ? 180 : 0}deg)`,
        opacity: flipped ? 1 : 0,
        config: { mass: 5, tension: 500, friction: 80 }
    });

    const playRevealSound = () => {
        if (audioRef.current && rarityEffect) {
            audioRef.current.src = rarityEffect.effects.sound;
            audioRef.current.play();
        }
    };

    const handleReveal = () => {
        setFlipped(true);
        playRevealSound();
        
        if (rarityEffect) {
            const config = particleConfigs[rarityEffect.effects.particles.color];
            createParticleSystem(config);
        }
    };

    return (
        <div className="card-reveal-container">
            <audio ref={audioRef} />
            
            <animated.div
                className={`card-container ${rarityEffect?.effects.animation}`}
                style={{ transform, opacity }}
                onClick={handleReveal}
            >
                <Canvas>
                    <PresentationControls
                        global
                        zoom={0.8}
                        rotation={[0, -Math.PI / 4, 0]}
                        polar={[-Math.PI / 4, Math.PI / 4]}
                        azimuth={[-Math.PI / 4, Math.PI / 4]}
                    >
                        <Card3D model={useGLTF('/models/card.glb') as GLTFResult} rarity={marketPrice} />
                    </PresentationControls>
                    
                    {rarityEffect && (
                        <ParticleEffect 
                            count={rarityEffect.effects.particles.count || 1000}
                            spread={rarityEffect.effects.particles.spread || 50}
                            speed={rarityEffect.effects.particles.speed || 0.5}
                            size={rarityEffect.effects.particles.size || 0.1}
                            color={rarityEffect.effects.particles.color || '#ffffff'}
                        />
                    )}
                </Canvas>

                <motion.div
                    className="card-aura"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </animated.div>
        </div>
    );
};

// Add particle configurations
const particleConfigs: Record<string, ParticleConfig> = {
    starfield: {
        count: 1000,
        spread: 50,
        speed: 0.5,
        size: 0.1,
        color: '#ffffff'
    },
    sparkles: {
        count: 500,
        spread: 30,
        speed: 1,
        size: 0.2,
        color: '#ffaa00'
    },
    dust: {
        count: 300,
        spread: 20,
        speed: 0.3,
        size: 0.05,
        color: '#4444ff'
    }
};
