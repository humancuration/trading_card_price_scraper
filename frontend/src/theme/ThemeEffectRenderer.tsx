import React, { useEffect, useRef } from 'react';
import { EffectType } from './ThemeEffects';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

interface ThemeEffectProps {
  type: EffectType;
  intensity?: number;
}

// Particle System for floating effects
const ParticleSystem: React.FC<{ count: number, color: string }> = ({ count, color }) => {
  const particles = useRef<THREE.Points>(null);

  useFrame(() => {
    if (particles.current) {
      particles.current.rotation.y += 0.001;
      const positions = particles.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.01;
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={count}
          array={new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 10)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={color} transparent opacity={0.6} />
    </points>
  );
};

// Fire Glow Effect
const FireGlow: React.FC = () => {
  return (
    <motion.div
      className="fire-glow-effect"
      animate={{
        boxShadow: [
          '0 0 20px rgba(255,77,77,0.5)',
          '0 0 40px rgba(255,77,77,0.3)',
          '0 0 20px rgba(255,77,77,0.5)',
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Water Ripple Effect
const WaterRipple: React.FC = () => {
  return (
    <div className="water-ripple-container">
      <motion.div
        className="ripple"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// Electric Spark Effect
const ElectricSpark: React.FC = () => {
  return (
    <motion.div
      className="spark"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 1, 0] }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 0.5,
      }}
    >
      <svg viewBox="0 0 100 100">
        <motion.path
          d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z"
          stroke="#ffcc00"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </motion.div>
  );
};

// Psychic Waves Effect
const PsychicWaves: React.FC = () => {
  return (
    <motion.div
      className="psychic-waves"
      animate={{
        background: [
          'radial-gradient(circle at center, #ff33cc 0%, transparent 50%)',
          'radial-gradient(circle at center, #9933ff 0%, transparent 50%)',
          'radial-gradient(circle at center, #ff33cc 0%, transparent 50%)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// Dragon Aura Effect
const DragonAura: React.FC = () => {
  return (
    <motion.div
      className="dragon-aura"
      animate={{
        filter: [
          'hue-rotate(0deg) brightness(1.2)',
          'hue-rotate(360deg) brightness(1.5)',
          'hue-rotate(0deg) brightness(1.2)',
        ],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// Holographic Shine Effect
const HoloShine: React.FC = () => {
  return (
    <motion.div
      className="holo-shine"
      animate={{
        background: [
          'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)',
          'linear-gradient(225deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)',
          'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

export const ThemeEffect: React.FC<ThemeEffectProps> = ({ type, intensity = 1 }) => {
  const getEffect = () => {
    switch (type) {
      case 'particles':
        return (
          <Canvas>
            <ParticleSystem count={1000} color="#ffffff" />
          </Canvas>
        );
      case 'fire_glow':
        return <FireGlow />;
      case 'water_ripple':
        return <WaterRipple />;
      case 'electric_spark':
        return <ElectricSpark />;
      case 'psychic_waves':
        return <PsychicWaves />;
      case 'dragon_aura':
        return <DragonAura />;
      case 'holo_shine':
        return <HoloShine />;
      default:
        return null;
    }
  };

  return (
    <div className={`theme-effect ${type}`} style={{ '--intensity': intensity } as any}>
      <AnimatePresence>
        {getEffect()}
      </AnimatePresence>
    </div>
  );
};
