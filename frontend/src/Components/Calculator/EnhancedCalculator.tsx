import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    TextField,
    Chip,
    Tooltip,
    IconButton,
    Fade,
    Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    LocalOffer,
    Timeline,
    ShowChart,
    AutoGraph
} from '@mui/icons-material';
import { useSpring, animated } from '@react-spring/web';

interface PriceData {
    currentPrice: number;
    historicalHigh: number;
    recentTrend: 'up' | 'down' | 'stable';
    percentageChange: number;
    lastUpdated: Date;
}

const EnhancedCalculator: React.FC = () => {
    const [cardName, setCardName] = useState('');
    const [priceData, setPriceData] = useState<PriceData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showTrendAnimation, setShowTrendAnimation] = useState(false);

    // Animated number display
    const { number } = useSpring({
        from: { number: 0 },
        number: priceData?.currentPrice || 0,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 }
    });

    // Price change animation
    const priceChangeAnimation = useSpring({
        opacity: showTrendAnimation ? 1 : 0,
        transform: showTrendAnimation 
            ? 'translateY(0px) scale(1)' 
            : 'translateY(20px) scale(0.9)',
        config: { tension: 300, friction: 20 }
    });

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Grid container spacing={3}>
                {/* Search Section */}
                <Grid item xs={12}>
                    <Card 
                        sx={{ 
                            p: 3,
                            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                            color: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                            Card Price Calculator
                        </Typography>
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter card name..."
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        borderRadius: '12px',
                                        '&:hover': {
                                            backgroundColor: 'white'
                                        }
                                    }
                                }}
                            />
                            <motion.div
                                animate={{ 
                                    scale: isLoading ? [1, 1.1, 1] : 1,
                                    rotate: isLoading ? [0, 180, 360] : 0
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            >
                                <ShowChart color="primary" />
                            </motion.div>
                        </Box>
                    </Card>
                </Grid>

                {/* Price Display */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <AnimatePresence>
                            {priceData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Typography variant="h3" gutterBottom>
                                        <animated.span>
                                            {number.to((n: number) => `$${n.toFixed(2)}`)}
                                        </animated.span>
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Chip
                                            icon={<TrendingUp />}
                                            label={`${priceData.percentageChange}%`}
                                            color={priceData.recentTrend === 'up' ? 'success' : 'error'}
                                        />
                                        <Chip
                                            icon={<Timeline />}
                                            label={`High: $${priceData.historicalHigh}`}
                                            color="primary"
                                        />
                                    </Box>
                                    <animated.div style={priceChangeAnimation}>
                                        <Paper 
                                            elevation={3}
                                            sx={{ 
                                                p: 2, 
                                                background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
                                                borderRadius: '12px'
                                            }}
                                        >
                                            <Typography variant="body1">
                                                Last updated: {priceData.lastUpdated.toLocaleDateString()}
                                            </Typography>
                                        </Paper>
                                    </animated.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </Grid>

                {/* Market Trends */}
                <Grid item xs={12} md={4}>
                    <Card 
                        sx={{ 
                            p: 3, 
                            height: '100%',
                            background: 'linear-gradient(135deg, #f5f5f5, #ffffff)'
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Market Trends
                        </Typography>
                        <Box sx={{ position: 'relative', height: 200 }}>
                            <AutoGraph 
                                sx={{ 
                                    position: 'absolute',
                                    fontSize: 120,
                                    opacity: 0.1,
                                    right: -20,
                                    bottom: -20
                                }} 
                            />
                            {/* Add trend visualization here */}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EnhancedCalculator;
