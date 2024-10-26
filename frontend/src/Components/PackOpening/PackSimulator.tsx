import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from '../../animations/AnimationComposer';
import { ParticleSystem } from '../../effects/ParticleEngine';
import { useTheme } from '@mui/material';
import { useSound } from '../../interactions/SoundManager';
import { useHaptics } from '../../interactions/SoundManager';

interface PackContents {
    common: number;
    uncommon: number;
    rare: number;
    ultraRare: number;
    secret: number;
}

interface Card {
    id: string;
    name: string;
    rarity: string;
    image: string;
    animation: string[];
    foil: boolean;
}

const getRandomCard = async (rarity: string): Promise<Card> => {
    try {
        const response = await fetch(`/api/cards/random/${rarity}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${rarity} card`);
        }
        
        return await response.json();
    } catch (error) {
        // Fallback mock card in case of API failure
        return {
            id: crypto.randomUUID(),
            name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Card`,
            rarity,
            image: `/assets/cards/${rarity}/placeholder.png`,
            animation: [],
            foil: Math.random() > 0.85
        };
    }
};

const PACK_CONFIGURATIONS = {
    standard: {
        common: 6,
        uncommon: 3,
        rare: 1,
        ultraRare: 0.2,  // 20% chance
        secret: 0.05     // 5% chance
    },
    premium: {
        common: 5,
        uncommon: 3,
        rare: 2,
        ultraRare: 0.4,  // 40% chance
        secret: 0.1      // 10% chance
    }
};

const PackSimulator: React.FC = () => {
    const [packState, setPackState] = useState<'sealed' | 'opening' | 'reveal'>('sealed');
    const [cards, setCards] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const theme = useTheme();
    const { playSound } = useSound();
    const { trigger: triggerHaptic } = useHaptics();

    const generatePack = async (config: PackContents) => {
        // Simulate API call to get random cards based on probabilities
        const packCards: Card[] = [];
        
        // Add guaranteed cards
        for (let i = 0; i < config.common; i++) {
            packCards.push(await getRandomCard('common'));
        }
        for (let i = 0; i < config.uncommon; i++) {
            packCards.push(await getRandomCard('uncommon'));
        }
        for (let i = 0; i < config.rare; i++) {
            packCards.push(await getRandomCard('rare'));
        }
        
        // Check for ultra rare
        if (Math.random() < config.ultraRare) {
            packCards.push(await getRandomCard('ultraRare'));
        }
        
        // Check for secret rare
        if (Math.random() < config.secret) {
            packCards.push(await getRandomCard('secret'));
        }
        
        // Shuffle the pack
        return packCards.sort(() => Math.random() - 0.5);
    };

    const handlePackOpen = async () => {
        setPackState('opening');
        const newCards = await generatePack(PACK_CONFIGURATIONS.standard);
        setCards(newCards);
        
        // Animate pack opening
        setTimeout(() => {
            setPackState('reveal');
        }, 1500);
    };

    const handleCardReveal = () => {
        playSound('card_flip');
        triggerHaptic('cardFlip');
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        }
    };

    const handleRareReveal = () => {
        playSound('rare_reveal');
        triggerHaptic('rareReveal');
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        }
    };

    const getCardAnimations = (card: Card) => {
        switch (card.rarity) {
            case 'secret':
                return ['mythicRainbow', 'prismaticBurst'];
            case 'ultraRare':
                return ['secretRare', 'stardust'];
            case 'rare':
                return ['holographic', 'sparkle'];
            default:
                return ['basic'];
        }
    };

    return (
        <div className="pack-simulator">
            <AnimatePresence>
                {packState === 'sealed' && (
                    <motion.div 
                        className="pack-wrapper"
                        whileHover={{ scale: 1.05 }}
                        onClick={handlePackOpen}
                    >
                        <img 
                            src="/images/sealed-pack.png" 
                            alt="Sealed Pack"
                            className="pack-image" 
                        />
                        <ParticleSystem
                            count={50}
                            spread={2}
                            size={3}        // Add required size prop
                            speed={1}       // Add required speed prop
                            color="#ffeb3b"
                            behavior="float"
                        />
                    </motion.div>
                )}

                {packState === 'opening' && (
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ 
                            scale: [1, 1.2, 0],
                            rotate: [0, 15, -15, 0],
                        }}
                        transition={{ duration: 1.5 }}
                        className="pack-opening"
                    >
                        <ParticleSystem
                            count={200}
                            spread={5}
                            size={3}        // Add required size prop
                            speed={1}       // Add required speed prop
                            color={["#ff9800", "#f44336", "#2196f3"]}
                            behavior="explode"
                        />
                    </motion.div>
                )}

                {packState === 'reveal' && (
                    <div className="card-reveal-area">
                        <motion.div 
                            className="swipe-indicator left"
                            animate={{ x: [-10, 0, -10] }}
                            transition={{ repeat: Infinity }}
                            onClick={() => handleCardReveal()}
                        />
                        
                        <AnimatedCard
                            animations={getCardAnimations(cards[currentCardIndex])}
                            className="card-display"
                        >
                            <img 
                                src={cards[currentCardIndex].image}
                                alt={cards[currentCardIndex].name}
                            />
                        </AnimatedCard>

                        <motion.div 
                            className="swipe-indicator right"
                            animate={{ x: [10, 0, 10] }}
                            transition={{ repeat: Infinity }}
                            onClick={() => handleRareReveal()}
                        />

                        <div className="card-counter">
                            {currentCardIndex + 1} / {cards.length}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PackSimulator;
