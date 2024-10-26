import React, { useEffect, useRef, useContext, createContext } from 'react';

interface Sound {
    id: string;
    url: string;
    volume?: number;
    category: 'ui' | 'effect' | 'ambient';
}

const soundLibrary: Sound[] = [
    // UI Sounds
    { id: 'click', url: '/sounds/ui/click.mp3', volume: 0.5, category: 'ui' },
    { id: 'hover', url: '/sounds/ui/hover.mp3', volume: 0.3, category: 'ui' },
    { id: 'success', url: '/sounds/ui/success.mp3', volume: 0.6, category: 'ui' },
    
    // Card Effects
    { id: 'card_flip', url: '/sounds/effects/card_flip.mp3', volume: 0.7, category: 'effect' },
    { id: 'card_slide', url: '/sounds/effects/card_slide.mp3', volume: 0.5, category: 'effect' },
    { id: 'rare_reveal', url: '/sounds/effects/rare_reveal.mp3', volume: 0.8, category: 'effect' },
    { id: 'mythic_reveal', url: '/sounds/effects/mythic_reveal.mp3', volume: 1.0, category: 'effect' },
    
    // Ambient
    { id: 'hover_loop', url: '/sounds/ambient/hover_loop.mp3', volume: 0.2, category: 'ambient' },
    { id: 'background', url: '/sounds/ambient/background.mp3', volume: 0.1, category: 'ambient' }
];

interface SoundContextType {
    playSound: (id: string) => void;
    stopSound: (id: string) => void;
    setVolume: (category: 'ui' | 'effect' | 'ambient', volume: number) => void;
    toggleMute: (category: 'ui' | 'effect' | 'ambient') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
    const volumeRefs = useRef<Map<string, number>>(new Map());
    const categoryMuted = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Preload all sounds
        soundLibrary.forEach(sound => {
            const audio = new Audio(sound.url);
            audio.volume = sound.volume || 1;
            audioRefs.current.set(sound.id, audio);
            volumeRefs.current.set(sound.id, sound.volume || 1);
        });

        return () => {
            // Cleanup
            audioRefs.current.forEach(audio => {
                audio.pause();
                audio.src = '';
            });
            audioRefs.current.clear();
        };
    }, []);

    const playSound = async (id: string) => {
        const audio = audioRefs.current.get(id);
        if (!audio) return;

        const sound = soundLibrary.find(s => s.id === id);
        if (!sound || categoryMuted.current.has(sound.category)) return;

        try {
            // Reset and play
            audio.currentTime = 0;
            await audio.play();

            // Add subtle variation to non-UI sounds for more natural feel
            if (sound.category !== 'ui') {
                audio.playbackRate = 0.9 + Math.random() * 0.2; // Random speed between 0.9 and 1.1
                audio.volume = (volumeRefs.current.get(id) || 1) * (0.9 + Math.random() * 0.2);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const stopSound = (id: string) => {
        const audio = audioRefs.current.get(id);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    };

    const setVolume = (category: 'ui' | 'effect' | 'ambient', volume: number) => {
        soundLibrary
            .filter(sound => sound.category === category)
            .forEach(sound => {
                const audio = audioRefs.current.get(sound.id);
                if (audio) {
                    audio.volume = volume;
                    volumeRefs.current.set(sound.id, volume);
                }
            });
    };

    const toggleMute = (category: 'ui' | 'effect' | 'ambient') => {
        if (categoryMuted.current.has(category)) {
            categoryMuted.current.delete(category);
            soundLibrary
                .filter(sound => sound.category === category)
                .forEach(sound => {
                    const audio = audioRefs.current.get(sound.id);
                    if (audio) {
                        audio.volume = volumeRefs.current.get(sound.id) || 1;
                    }
                });
        } else {
            categoryMuted.current.add(category);
            soundLibrary
                .filter(sound => sound.category === category)
                .forEach(sound => {
                    const audio = audioRefs.current.get(sound.id);
                    if (audio) {
                        audio.volume = 0;
                    }
                });
        }
    };

    return (
        <SoundContext.Provider value={{ playSound, stopSound, setVolume, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};

// Custom hook for haptic feedback patterns
export const useHaptics = () => {
    const patterns = {
        soft: [10],
        medium: [30],
        hard: [50],
        double: [30, 50, 30],
        success: [30, 50, 100],
        error: [100, 30, 100],
        warning: [50, 30, 50],
        cardFlip: [20, 40, 20],
        cardReveal: [30, 50, 100, 50, 30],
        rareReveal: [50, 30, 100, 30, 100, 30, 50]
    };

    const trigger = (pattern: keyof typeof patterns) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(patterns[pattern]);
        }
    };

    return { trigger, patterns };
};
