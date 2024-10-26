import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ParticleSystemProps {
    count: number;
    spread: number;
    size: number;
    speed: number;
    color: string | string[];
    shape?: 'point' | 'sprite' | 'custom';
    texture?: string;
    behavior: 'float' | 'explode' | 'swirl' | 'rain' | 'custom';
    customBehavior?: (particle: THREE.Vector3, time: number) => void;
    lifespan?: number;
    emissionRate?: number;
    blending?: THREE.BlendingDstFactor;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
    count,
    spread,
    size,
    speed,
    color,
    shape = 'point',
    texture,
    behavior = 'float',
    customBehavior,
    lifespan = 2,
    emissionRate = 50,
    blending = THREE.AdditiveBlending
}) => {
    const particles = useRef<THREE.Points>(null);
    const particleData = useRef<Float32Array>();
    const velocities = useRef<Float32Array>();
    const lifetimes = useRef<Float32Array>();

    useEffect(() => {
        if (!particles.current) return;

        // Initialize particle data
        particleData.current = new Float32Array(count * 3);
        velocities.current = new Float32Array(count * 3);
        lifetimes.current = new Float32Array(count);

        resetParticle(0, count);
    }, [count, spread]);

    const resetParticle = (startIndex: number, endIndex: number) => {
        if (!particleData.current || !velocities.current || !lifetimes.current) return;

        for (let i = startIndex; i < endIndex; i++) {
            const i3 = i * 3;
            
            // Position
            particleData.current[i3] = (Math.random() - 0.5) * spread;
            particleData.current[i3 + 1] = (Math.random() - 0.5) * spread;
            particleData.current[i3 + 2] = (Math.random() - 0.5) * spread;

            // Velocity
            velocities.current[i3] = (Math.random() - 0.5) * speed;
            velocities.current[i3 + 1] = (Math.random() - 0.5) * speed;
            velocities.current[i3 + 2] = (Math.random() - 0.5) * speed;

            // Lifetime
            lifetimes.current[i] = Math.random() * lifespan;
        }
    };

    useFrame(({ clock }) => {
        if (!particles.current || !particleData.current || !velocities.current || !lifetimes.current) return;

        const time = clock.getElapsedTime();
        const positions = particles.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Update lifetime
            lifetimes.current[i] -= 0.016; // Approximately one frame at 60fps
            if (lifetimes.current[i] <= 0) {
                resetParticle(i, i + 1);
                continue;
            }

            // Apply behavior
            switch (behavior) {
                case 'float':
                    positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.01;
                    break;
                case 'explode':
                    positions[i3] += velocities.current[i3] * speed;
                    positions[i3 + 1] += velocities.current[i3 + 1] * speed;
                    positions[i3 + 2] += velocities.current[i3 + 2] * speed;
                    break;
                case 'swirl':
                    const angle = time * speed;
                    const radius = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 2] * positions[i3 + 2]);
                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 2] = Math.sin(angle) * radius;
                    break;
                case 'custom':
                    if (customBehavior) {
                        customBehavior(new THREE.Vector3(
                            positions[i3],
                            positions[i3 + 1],
                            positions[i3 + 2]
                        ), time);
                    }
                    break;
            }
        }

        particles.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particles}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particleData.current || new Float32Array(count * 3)}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={size}
                color={color}
                transparent
                blending={blending}
                depthWrite={false}
            />
        </points>
    );
};
