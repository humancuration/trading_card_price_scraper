import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';

const PageCard = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.palette.background.paper};
  border-radius: 16px;
  overflow: hidden;
  backface-visibility: hidden;
  transform-style: preserve-3d;
`;

const cardVariants = {
  initial: (direction: number) => ({
    rotateY: direction > 0 ? 90 : -90,
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  animate: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1],
    },
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -90 : 90,
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1],
    },
  }),
};

const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const [direction, setDirection] = React.useState(0);

  React.useEffect(() => {
    // Determine direction based on navigation history
    const paths = ['/dashboard', '/pack-simulator', '/analytics', '/about'];
    const currentIndex = paths.indexOf(location.pathname);
    const lastPath = sessionStorage.getItem('lastPath');
    const lastIndex = paths.indexOf(lastPath || '');
    
    setDirection(currentIndex > lastIndex ? 1 : -1);
    sessionStorage.setItem('lastPath', location.pathname);
  }, [location]);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <PageCard
        key={location.pathname}
        custom={direction}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          boxShadow: theme.shadows[10],
        }}
      >
        {children}
      </PageCard>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
