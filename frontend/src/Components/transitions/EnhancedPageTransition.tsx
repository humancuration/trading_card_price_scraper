import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import { RevealSequence, revealSequences } from '../../theme/CardRevealEffects';
import { ParticleSystem } from '../../effects/ParticleEngine';
import { useSound } from '../../interactions/SoundManager';

const PageCard = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100vh;
  background: ${props => props.theme.palette.background.paper};
  border-radius: 16px;
  overflow: hidden;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  perspective: 1500px;
`;

const getPageRarity = (pathname: string): 'mythic' | 'ultraRare' | 'rare' => {
  switch (pathname) {
    case '/pack-simulator':
      return 'mythic';
    case '/analytics':
      return 'ultraRare';
    default:
      return 'rare';
  }
};

const EnhancedPageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const [direction, setDirection] = React.useState(0);
  const { playSound } = useSound();
  
  // Reference the reveal sequences from CardRevealEffects
  const rarity = getPageRarity(location.pathname);
  const sequence = revealSequences[rarity];

  const cardVariants = {
    initial: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      x: direction > 0 ? 1000 : -1000,
      scale: 0.8,
      opacity: 0,
    }),
    animate: {
      rotateY: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: sequence.flipDuration,
        ease: [0.645, 0.045, 0.355, 1.000],
      }
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      x: direction > 0 ? -1000 : 1000,
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: sequence.flipDuration * 0.8,
        ease: [0.645, 0.045, 0.355, 1.000],
      }
    })
  };

  useEffect(() => {
    const paths = ['/dashboard', '/pack-simulator', '/analytics', '/about'];
    const currentIndex = paths.indexOf(location.pathname);
    const lastPath = sessionStorage.getItem('lastPath');
    const lastIndex = paths.indexOf(lastPath || '');
    
    setDirection(currentIndex > lastIndex ? 1 : -1);
    sessionStorage.setItem('lastPath', location.pathname);
    playSound('card_flip'); // Use the sound ID defined in soundLibrary
  }, [location, playSound]);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <PageCard
        key={location.pathname}
        custom={direction}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`card-reveal-container ${rarity}-float`}
      >
        <motion.div
          className={`card-aura ${rarity}-glow`}
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
        
        <ParticleSystem
          count={100}
          spread={direction > 0 ? 3 : -3}
          size={2}
          speed={1}
          color="#ffeb3b"
          behavior="float"
        />
        
        {children}
      </PageCard>
    </AnimatePresence>
  );
};

export default EnhancedPageTransition;
