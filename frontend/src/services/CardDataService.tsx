import { CardRarity, CardType, CardSet } from '../types/cards';

interface CardData {
    id: string;
    name: string;
    set: CardSet;
    rarity: CardRarity;
    type: CardType;
    image: string;
    marketPrice: number;
    foil: boolean;
    edition?: string;
    number?: string;
    artist?: string;
}

// Example data structure for pack odds
const packOdds = {
    standard: {
        common: { count: 6, chance: 1 },
        uncommon: { count: 3, chance: 1 },
        rare: { count: 1, chance: 1 },
        ultraRare: { count: 0, chance: 0.2 },
        secret: { count: 0, chance: 0.05 }
    },
    premium: {
        common: { count: 5, chance: 1 },
        uncommon: { count: 3, chance: 1 },
        rare: { count: 2, chance: 1 },
        ultraRare: { count: 0, chance: 0.4 },
        secret: { count: 0, chance: 0.1 }
    }
};

class CardDataService {
    private static instance: CardDataService;
    private cardCache: Map<string, CardData> = new Map();
    private setData: Map<string, CardData[]> = new Map();

    private constructor() {
        // Initialize with some data or load from API
    }

    static getInstance(): CardDataService {
        if (!CardDataService.instance) {
            CardDataService.instance = new CardDataService();
        }
        return CardDataService.instance;
    }

    async generatePack(setId: string, packType: 'standard' | 'premium' = 'standard'): Promise<CardData[]> {
        const odds = packOdds[packType];
        const pack: CardData[] = [];
        const setCards = await this.getSetCards(setId);

        // Helper function to get random cards of a specific rarity
        const getRandomCards = (rarity: CardRarity, count: number): CardData[] => {
            const rarityCards = setCards.filter(card => card.rarity === rarity);
            const selected: CardData[] = [];
            for (let i = 0; i < count; i++) {
                const randomIndex = Math.floor(Math.random() * rarityCards.length);
                selected.push(rarityCards[randomIndex]);
            }
            return selected;
        };

        // Add guaranteed cards
        pack.push(...getRandomCards('common', odds.common.count));
        pack.push(...getRandomCards('uncommon', odds.uncommon.count));
        pack.push(...getRandomCards('rare', odds.rare.count));

        // Check for ultra rare
        if (Math.random() < odds.ultraRare.chance) {
            pack.push(...getRandomCards('ultraRare', 1));
        }

        // Check for secret rare
        if (Math.random() < odds.secret.chance) {
            pack.push(...getRandomCards('secret', 1));
        }

        // Calculate pack value
        const packValue = pack.reduce((total, card) => total + card.marketPrice, 0);

        // Trigger appropriate effects based on value
        if (packValue >= 1000) {
            // Trigger jackpot effects
            this.triggerJackpotEffects(packValue);
        } else if (packValue >= 500) {
            // Trigger high value effects
            this.triggerHighValueEffects(packValue);
        }

        return this.shufflePack(pack);
    }

    private shufflePack(pack: CardData[]): CardData[] {
        // Fisher-Yates shuffle
        for (let i = pack.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pack[i], pack[j]] = [pack[j], pack[i]];
        }
        return pack;
    }

    private async getSetCards(setId: string): Promise<CardData[]> {
        if (this.setData.has(setId)) {
            return this.setData.get(setId)!;
        }

        // In a real implementation, this would fetch from your API
        const response = await fetch(`/api/sets/${setId}/cards`);
        const cards = await response.json();
        this.setData.set(setId, cards);
        return cards;
    }

    private triggerJackpotEffects(value: number) {
        // Trigger special effects for jackpot pulls
        document.dispatchEvent(new CustomEvent('jackpot-pull', { 
            detail: { value, timestamp: Date.now() }
        }));
    }

    private triggerHighValueEffects(value: number) {
        // Trigger effects for high value pulls
        document.dispatchEvent(new CustomEvent('high-value-pull', {
            detail: { value, timestamp: Date.now() }
        }));
    }

    // Statistics tracking
    async trackPullStatistics(cards: CardData[]) {
        const stats = {
            timestamp: Date.now(),
            totalValue: cards.reduce((sum, card) => sum + card.marketPrice, 0),
            rarityDistribution: cards.reduce((dist, card) => {
                dist[card.rarity] = (dist[card.rarity] || 0) + 1;
                return dist;
            }, {} as Record<CardRarity, number>),
            highestValue: Math.max(...cards.map(card => card.marketPrice))
        };

        // In a real implementation, send to your analytics service
        await fetch('/api/statistics/pulls', {
            method: 'POST',
            body: JSON.stringify(stats)
        });
    }
}

export default CardDataService;
