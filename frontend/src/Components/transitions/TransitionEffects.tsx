import React from 'react';
import { motion } from 'framer-motion';
import { ParticleSystem } from '../../effects/ParticleEngine';
import { environmentalEffects } from '../../theme/CardRevealSequences';
import { themeEffects } from '../../theme/ThemeEffects';

interface TransitionEffectProps {
  direction: number;
  type: 'page' | 'modal' | 'drawer';
  rarity?: 'mythic' | 'ultraRare' | 'rare';
}

export const TransitionEffect: React.FC<TransitionEffectProps> = ({ 
  direction, 
  type,
  rarity = 'rare' 
}) => {
  const getParticleBehavior = () => {
    switch (type) {
      case 'page':
        return 'swirl';
      case 'modal':
        return 'explode';
      case 'drawer':
        return 'float';
      default:
        return 'float';
    }
  };

  const getEnvironmentalEffect = () => {
    return environmentalEffects.particles[rarity];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="transition-effect-container"
    >
      <ParticleSystem
        count={200}
        spread={direction > 0 ? 5 : -5}
        size={3}
        speed={2}
        color={["#ff9800", "#f44336", "#2196f3"]}
        behavior={getParticleBehavior()}
      />
      
      {/* Add environmental effects based on rarity */}
      <motion.div
        className={`environmental-effect ${getEnvironmentalEffect()}`}
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
    </motion.div>
  );
};

// Additional effect components using existing animations
export const CardFlipTransition: React.FC<{ direction: number }> = ({ direction }) => {
  return (
    <motion.div
      className="card-flip-transition"
      initial={{ rotateY: direction > 0 ? -90 : 90 }}
      animate={{ rotateY: 0 }}
      exit={{ rotateY: direction > 0 ? 90 : -90 }}
      transition={{
        duration: 0.6,
        ease: [0.645, 0.045]}}/>)}