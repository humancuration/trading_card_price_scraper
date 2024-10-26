import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls } from '@react-three/drei';

interface CardRarityEffect {
    threshold: number;  // Price threshold or rarity score
    effects: {
        glow: string;
        particles: string;
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
            particles: 'starfield',
            sound: '/sounds/mythic-reveal.mp3',
            animation: 'mythic-float',
            aura: 'legendary-flames'
        }
    },
    {
        threshold: 500,  // Super Rare
        effects: {
            glow: 'golden-shine',
            particles: 'sparkles',
            sound: '/sounds/rare-reveal.mp3',
            animation: 'rare-spin',
            aura: 'rare-glow'
        }
    },
    {
        threshold: 100,  // Rare
        effects: {
            glow: 'blue-essence',
            particles: 'dust',
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

const Card3D: React.FC<{ model: Card3DModel, rarity: number }> = ({ model, rarity }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const rarityEffect = rarityEffects.find(effect => rarity >= effect.threshold);

    useFrame(({ clock }) => {
        if (meshRef.current && rarityEffect) {
            // Add floating animation
            meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
            
            // Add rotation based on rarity
            if (rarity > 500) {
                meshRef.current.rotation.y += 0.01;
            }
        }
    });

    return (
        <mesh ref={meshRef} geometry={model.geometry}>
            {model.materials.map((material, index) => (
                <meshStandardMaterial 
                    key={index}
                    {...material}
                    emissive={rarityEffect?.effects.glow}
                    emissiveIntensity={rarity / 1000}
                />
            ))}
        </mesh>
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
        
        // Trigger particle effects
        if (rarityEffect) {
            // Create particle system based on rarity
            createParticleSystem(rarityEffect.effects.particles);
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
                        <Card3D model={useGLTF('/models/card.glb')} rarity={marketPrice} />
                    </PresentationControls>
                    
                    {rarityEffect && (
                        <Particles
                            type={rarityEffect.effects.particles}
                            intensity={marketPrice / 1000}
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
