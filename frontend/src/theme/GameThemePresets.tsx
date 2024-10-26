import { ThemeConfig } from './ThemeContext';

export interface GameThemeConfig extends ThemeConfig {
    name: string;
    description: string;
    brandColors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    backgroundEffect?: string;
    cardFrameStyle?: string;
    animations?: {
        reveal: string;
        hover: string;
        transition: string;
    };
    soundEffects?: {
        reveal: string;
        hover: string;
        select: string;
    };
}

export const gameThemePresets: Record<string, GameThemeConfig> = {
    // Pokémon TCG Themes
    pokemon: {
        name: "Pokémon TCG",
        description: "Classic Pokémon Trading Card Game style",
        brandColors: {
            primary: "#FF0000", // Pokémon Red
            secondary: "#FFDE00", // Pokémon Yellow
            accent: "#3B4CCA"  // Pokémon Blue
        },
        palette: {
            primary: {
                main: "#FF0000",
                light: "#FF4444",
                dark: "#CC0000"
            },
            secondary: {
                main: "#FFDE00",
                light: "#FFE744",
                dark: "#CCB200"
            },
            background: {
                default: "#f7f7f7",
                paper: "#ffffff"
            },
            text: {
                primary: "#333333",
                secondary: "#666666"
            }
        },
        backgroundEffect: "radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.1), transparent 70%)",
        cardFrameStyle: "pokemon-holo",
        animations: {
            reveal: "pokemon-card-flip",
            hover: "pokemon-card-shine",
            transition: "pokemon-energy-swirl"
        },
        soundEffects: {
            reveal: "/sounds/pokemon-card-flip.mp3",
            hover: "/sounds/pokemon-hover.mp3",
            select: "/sounds/pokemon-select.mp3"
        }
    },

    // Magic: The Gathering Themes
    mtg: {
        name: "Magic: The Gathering",
        description: "Classic MTG design with mana colors",
        brandColors: {
            primary: "#1C0B2B", // MTG Purple
            secondary: "#BF9B30", // MTG Gold
            accent: "#E6E7E4"  // MTG Silver
        },
        palette: {
            primary: {
                main: "#1C0B2B",
                light: "#2D1645",
                dark: "#0E0517"
            },
            secondary: {
                main: "#BF9B30",
                light: "#D4B654",
                dark: "#8C7223"
            },
            background: {
                default: "#1a1a1a",
                paper: "#2d2d2d"
            },
            text: {
                primary: "#ffffff",
                secondary: "#cccccc"
            }
        },
        backgroundEffect: "linear-gradient(45deg, rgba(28, 11, 43, 0.9), rgba(191, 155, 48, 0.2))",
        cardFrameStyle: "mtg-modern",
        animations: {
            reveal: "mtg-card-reveal",
            hover: "mtg-mana-glow",
            transition: "mtg-planeswalker-spark"
        },
        soundEffects: {
            reveal: "/sounds/mtg-card-reveal.mp3",
            hover: "/sounds/mtg-hover.mp3",
            select: "/sounds/mtg-select.mp3"
        }
    },

    // Yu-Gi-Oh! Themes
    yugioh: {
        name: "Yu-Gi-Oh!",
        description: "Classic Yu-Gi-Oh! style with millennium items",
        brandColors: {
            primary: "#DAA520", // YGO Gold
            secondary: "#4A4A4A", // YGO Dark Gray
            accent: "#8B0000"  // YGO Dark Red
        },
        palette: {
            primary: {
                main: "#DAA520",
                light: "#FFD700",
                dark: "#B8860B"
            },
            secondary: {
                main: "#4A4A4A",
                light: "#666666",
                dark: "#333333"
            },
            background: {
                default: "#000000",
                paper: "#1a1a1a"
            },
            text: {
                primary: "#ffffff",
                secondary: "#DAA520"
            }
        },
        backgroundEffect: "radial-gradient(circle at center, rgba(218, 165, 32, 0.2), transparent 70%), url('/images/millennium-pattern.png')",
        cardFrameStyle: "yugioh-classic",
        animations: {
            reveal: "yugioh-millennium-reveal",
            hover: "yugioh-shadow-realm",
            transition: "yugioh-mind-crush"
        },
        soundEffects: {
            reveal: "/sounds/yugioh-card-reveal.mp3",
            hover: "/sounds/yugioh-hover.mp3",
            select: "/sounds/yugioh-select.mp3"
        }
    }
};

// CSS Animations for each theme
export const themeAnimations = `
    /* Pokémon Animations */
    @keyframes pokemon-card-flip {
        0% { transform: perspective(1000px) rotateY(0deg); }
        100% { transform: perspective(1000px) rotateY(360deg); }
    }

    @keyframes pokemon-card-shine {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
    }

    @keyframes pokemon-energy-swirl {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
    }

    /* MTG Animations */
    @keyframes mtg-card-reveal {
        0% { transform: scale(0.8) translateY(50px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    @keyframes mtg-mana-glow {
        0% { filter: drop-shadow(0 0 5px rgba(191, 155, 48, 0)); }
        50% { filter: drop-shadow(0 0 20px rgba(191, 155, 48, 0.8)); }
        100% { filter: drop-shadow(0 0 5px rgba(191, 155, 48, 0)); }
    }

    @keyframes mtg-planeswalker-spark {
        0% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.1); filter: brightness(1.5); }
        100% { transform: scale(1); filter: brightness(1); }
    }

    /* Yu-Gi-Oh! Animations */
    @keyframes yugioh-millennium-reveal {
        0% { transform: translateY(-100px) scale(0); opacity: 0; }
        50% { transform: translateY(20px) scale(1.2); opacity: 0.8; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    @keyframes yugioh-shadow-realm {
        0% { box-shadow: 0 0 10px rgba(218, 165, 32, 0.5); }
        50% { box-shadow: 0 0 30px rgba(218, 165, 32, 0.8); }
        100% { box-shadow: 0 0 10px rgba(218, 165, 32, 0.5); }
    }

    @keyframes yugioh-mind-crush {
        0% { filter: hue-rotate(0deg) brightness(1); }
        50% { filter: hue-rotate(180deg) brightness(1.5); }
        100% { filter: hue-rotate(360deg) brightness(1); }
    }
`;

export const useGameTheme = (game: keyof typeof gameThemePresets) => {
    return gameThemePresets[game];
};
