import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParticleConfig } from '../types';

export const createParticleSystem = (config: ParticleConfig) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const velocities = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * config.spread;
        positions[i3 + 1] = (Math.random() - 0.5) * config.spread;
        positions[i3 + 2] = (Math.random() - 0.5) * config.spread;

        velocities[i3] = (Math.random() - 0.5) * config.speed;
        velocities[i3 + 1] = (Math.random() - 0.5) * config.speed;
        velocities[i3 + 2] = (Math.random() - 0.5) * config.speed;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    return geometry;
};

export const ParticleEffect: React.FC<ParticleConfig> = (props) => {
    const particlesRef = useRef<THREE.Points>(null);

    useFrame(({ clock }) => {
        if (!particlesRef.current) return;

        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
        const time = clock.getElapsedTime();

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * props.speed;
            positions[i + 1] += velocities[i + 1] * props.speed;
            positions[i + 2] += velocities[i + 2] * props.speed;

            // Add some wavey motion
            positions[i] += Math.sin(time + positions[i]) * 0.01;
            positions[i + 1] += Math.cos(time + positions[i + 1]) * 0.01;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry {...createParticleSystem(props)} />
            <pointsMaterial
                size={props.size}
                color={props.color}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};
