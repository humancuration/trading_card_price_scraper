import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material';
import { ThemeEffect } from './ThemeEffects';

// Define theme types
export type ThemeType = 'light' | 'dark' | 'fire' | 'water' | 'grass' | 'electric' | 'dragon' | 'psychic' | 'holographic';

// Declare the type here or in a separate types file
export type EffectType = 
  | 'particles' 
  | 'floating_cards' 
  | 'fire_glow' 
  | 'water_ripple'
  | 'electric_spark'
  | 'psychic_waves'
  | 'dragon_aura'
  | 'holo_shine'
  | 'card_flip';

interface ThemeContextType {
    currentTheme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    activeEffects: EffectType[];
    toggleEffect: (effect: EffectType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme configurations
const themeConfigs: Record<ThemeType, {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    gradient?: string;
}> = {
    light: {
        primary: '#2196f3',
        secondary: '#1976d2',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#000000',
    },
    dark: {
        primary: '#bb86fc',
        secondary: '#3700b3',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
    },
    fire: {
        primary: '#ff4d4d',
        secondary: '#ffaa33',
        background: '#1a0f0f',
        surface: '#2d1f1f',
        text: '#ffffff',
        gradient: 'linear-gradient(45deg, #ff4d4d 0%, #ff8c1a 100%)',
    },
    water: {
        primary: '#3399ff',
        secondary: '#00ccff',
        background: '#0f1a2d',
        surface: '#1f2d3d',
        text: '#ffffff',
        gradient: 'radial-gradient(circle, #3399ff 0%, #0066cc 100%)',
    },
    grass: {
        primary: '#4caf50',
        secondary: '#388e3c',
        background: '#1a2f1a',
        surface: '#2d3d2d',
        text: '#ffffff',
        gradient: 'linear-gradient(45deg, #4caf50 0%, #81c784 100%)',
    },
    electric: {
        primary: '#ffd700',
        secondary: '#ffeb3b',
        background: '#2d2d1a',
        surface: '#3d3d2a',
        text: '#ffffff',
        gradient: 'linear-gradient(45deg, #ffd700 0%, #ffeb3b 100%)',
    },
    dragon: {
        primary: '#7038f8',
        secondary: '#483d8b',
        background: '#1a1a2e',
        surface: '#2a2a3e',
        text: '#ffffff',
        gradient: 'linear-gradient(45deg, #7038f8 0%, #483d8b 100%)',
    },
    psychic: {
        primary: '#ff69b4',
        secondary: '#da70d6',
        background: '#2e1a2e',
        surface: '#3e2a3e',
        text: '#ffffff',
        gradient: 'radial-gradient(circle, #ff69b4 0%, #da70d6 100%)',
    },
    holographic: {
        primary: '#00ffff',
        secondary: '#ff00ff',
        background: '#000000',
        surface: '#1a1a1a',
        text: '#ffffff',
        gradient: 'linear-gradient(45deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%)',
    },
};

// Add this interface export
export interface ThemeConfig {
    palette: {
        primary: {
            main: string;
            light?: string;
            dark?: string;
        };
        secondary: {
            main: string;
            light?: string;
            dark?: string;
        };
        background: {
            default: string;
            paper: string;
        };
        text: {
            primary: string;
            secondary?: string;
        };
    };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
    const [activeEffects, setActiveEffects] = useState<EffectType[]>([]);

    const toggleEffect = (effect: EffectType) => {
        setActiveEffects(prev => 
            prev.includes(effect)
                ? prev.filter(e => e !== effect)
                : [...prev, effect]
        );
    };

    const createCustomTheme = (themeType: ThemeType) => {
        const config = themeConfigs[themeType];
        
        return createTheme({
            palette: {
                mode: themeType === 'dark' ? 'dark' : 'light',
                primary: {
                    main: config.primary,
                },
                secondary: {
                    main: config.secondary,
                },
                background: {
                    default: config.background,
                    paper: config.surface,
                },
                text: {
                    primary: config.text,
                },
            },
            components: {
                MuiCard: {
                    styleOverrides: {
                        root: {
                            background: config.gradient || config.surface,
                            backgroundSize: '200% 200%',
                            animation: config.gradient ? 'gradient 15s ease infinite' : 'none',
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            background: config.gradient || config.primary,
                            color: config.text,
                            '&:hover': {
                                background: config.gradient || config.secondary,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s ease',
                            },
                        },
                    },
                },
                // Add more component customizations
            },
        });
    };

    const theme = createCustomTheme(currentTheme);

    return (
        <ThemeContext.Provider value={{ 
            currentTheme, 
            setTheme: setCurrentTheme,
            activeEffects,
            toggleEffect
        }}>
            <MUIThemeProvider theme={theme}>
                {children}
                {activeEffects.map(effect => (
                    <ThemeEffect key={effect} type={effect} />
                ))}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
