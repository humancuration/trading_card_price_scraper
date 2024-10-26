// Base card interface that all card games will extend
export interface BaseCard {
    id: string;
    name: string;
    setName: string;
    releaseDate?: Date;
    artist?: string;
    marketPrice: number;
    image: string;
    language?: string;
}

// Common card properties
export type Condition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Secret Rare' | 'Special';
export type FoilType = 'Non-Foil' | 'Foil' | 'Reverse Holo' | 'Etched' | 'Special';

// Pokemon specific types
export interface PokemonCard extends BaseCard {
    gameType: 'Pokemon';
    number: string;
    rarity: Rarity;
    type: PokemonType | PokemonType[];
    foilType: FoilType;
    edition?: PokemonEdition;
    variant?: PokemonVariant;
    isFirstEdition?: boolean;
    isShadowless?: boolean;
}

export type PokemonType = 
    | 'Fire' | 'Water' | 'Grass' | 'Electric' 
    | 'Psychic' | 'Fighting' | 'Dark' | 'Metal' 
    | 'Dragon' | 'Fairy' | 'Normal' | 'Colorless';

export type PokemonEdition = 
    | '1st Edition' 
    | 'Unlimited' 
    | 'Shadowless'
    | 'Limited Edition';

export type PokemonVariant = 
    | 'Regular'
    | 'Holo'
    | 'Reverse Holo'
    | 'Full Art'
    | 'Rainbow Rare'
    | 'Gold Star'
    | 'Shining'
    | 'Crystal';

// Magic: The Gathering specific types
export interface MagicCard extends BaseCard {
    gameType: 'Magic';
    manaCost?: string;
    type: MagicCardType[];
    rarity: Rarity;
    foilType: FoilType;
    set: string;
    collectorNumber: string;
    variant?: MagicVariant;
}

export type MagicCardType = 
    | 'Creature' | 'Instant' | 'Sorcery' 
    | 'Enchantment' | 'Artifact' | 'Land' 
    | 'Planeswalker' | 'Tribal';

export type MagicVariant = 
    | 'Normal'
    | 'Foil'
    | 'Extended Art'
    | 'Showcase'
    | 'Borderless'
    | 'Retro Frame';

// Yu-Gi-Oh specific types
export interface YuGiOhCard extends BaseCard {
    gameType: 'YuGiOh';
    cardType: YuGiOhCardType;
    attribute?: YuGiOhAttribute;
    level?: number;
    rarity: Rarity;
    variant?: YuGiOhVariant;
    edition?: YuGiOhEdition;
}

export type YuGiOhCardType = 
    | 'Normal Monster' | 'Effect Monster' 
    | 'Fusion Monster' | 'Ritual Monster'
    | 'Synchro Monster' | 'XYZ Monster'
    | 'Pendulum Monster' | 'Link Monster'
    | 'Spell Card' | 'Trap Card';

export type YuGiOhAttribute = 
    | 'DARK' | 'LIGHT' | 'EARTH' | 'WATER' 
    | 'FIRE' | 'WIND' | 'DIVINE';

export type YuGiOhVariant = 
    | 'Normal'
    | 'Ultra Rare'
    | 'Secret Rare'
    | 'Ultimate Rare'
    | 'Ghost Rare'
    | 'Starlight Rare';

export type YuGiOhEdition = 
    | '1st Edition'
    | 'Unlimited'
    | 'Limited Edition';

// Collection and Set interfaces
export interface CardSet<T extends BaseCard> {
    id: string;
    name: string;
    releaseDate: Date;
    cards: T[];
    totalCards: number;
    language: string;
    setSymbol?: string;
}

export interface CardCollection<T extends BaseCard> {
    cards: {
        card: T;
        quantity: number;
        condition: Condition;
        isFoil: boolean;
        purchasePrice?: number;
        purchaseDate?: Date;
        notes?: string;
    }[];
    totalValue: number;
    lastUpdated: Date;
}

// Price tracking interfaces
export interface PriceHistory {
    date: Date;
    price: number;
    condition: Condition;
    isFoil: boolean;
    source: string;
}

export interface MarketData {
    cardId: string;
    currentPrice: number;
    lastUpdated: Date;
    priceHistory: PriceHistory[];
    trendData: {
        daily: number;
        weekly: number;
        monthly: number;
        yearly: number;
    };
}

// Animation and effect mappings
export interface CardAnimationConfig {
    rarity: Rarity;
    animations: string[];
    particles: string[];
    sounds: string[];
    haptics: number[];
}

export const cardAnimationMappings: Record<Rarity, CardAnimationConfig> = {
    'Common': {
        rarity: 'Common',
        animations: ['basic'],
        particles: ['simple'],
        sounds: ['card_flip'],
        haptics: [50]
    },
    'Uncommon': {
        rarity: 'Uncommon',
        animations: ['shine'],
        particles: ['sparkle'],
        sounds: ['card_flip', 'sparkle'],
        haptics: [50, 30]
    },
    'Rare': {
        rarity: 'Rare',
        animations: ['glow', 'float'],
        particles: ['stardust'],
        sounds: ['card_flip', 'rare_reveal'],
        haptics: [50, 30, 50]
    },
    'Ultra Rare': {
        rarity: 'Ultra Rare',
        animations: ['prismatic', 'float'],
        particles: ['starburst', 'trail'],
        sounds: ['card_flip', 'ultra_reveal', 'sparkle'],
        haptics: [70, 40, 70, 40]
    },
    'Secret Rare': {
        rarity: 'Secret Rare',
        animations: ['rainbow', 'float', 'pulse'],
        particles: ['rainbow', 'starburst', 'trail'],
        sounds: ['card_flip', 'secret_reveal', 'choir'],
        haptics: [100, 50, 100, 50, 100]
    },
    'Special': {
        rarity: 'Special',
        animations: ['custom'],
        particles: ['custom'],
        sounds: ['custom'],
        haptics: [100, 50, 100]
    }
};
