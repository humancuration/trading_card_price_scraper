import React from 'react';
import { Card, Typography, Box, Grid, Chip, Tooltip } from '@mui/material';

interface PackPreset {
    name: string;
    description: string;
    packPrice: number;
    pullRates: {
        [key: string]: {
            chance: number;
            averageValue: number;
            maxValue: number;
        };
    };
    expectedValue: number;
    variance: number;
    notes: string[];
    yearReleased?: number;
    historicalData?: {
        date: string;
        packPrice: number;
        evRatio: number; // EV/Pack Price ratio
    }[];
}

// Real-world pack data and statistics
const packPresets: Record<string, PackPreset> = {
    "Base Set Booster": {
        name: "Base Set Booster Pack",
        description: "Original Pokemon TCG booster pack",
        packPrice: 4.99,
        pullRates: {
            holoRare: { chance: 0.33, averageValue: 12, maxValue: 100 },
            rare: { chance: 0.67, averageValue: 1.5, maxValue: 10 },
            uncommon: { chance: 1.0, averageValue: 0.25, maxValue: 2 },
            common: { chance: 1.0, averageValue: 0.10, maxValue: 1 }
        },
        expectedValue: 3.85,
        variance: 8.2,
        notes: [
            "33% chance of holo rare per pack",
            "Guaranteed rare slot may be holo",
            "3 uncommons and 5 commons per pack"
        ],
        yearReleased: 1999,
        historicalData: [
            { date: "1999", packPrice: 3.99, evRatio: 1.2 },
            { date: "2010", packPrice: 5.99, evRatio: 0.8 },
            { date: "2020", packPrice: 100.00, evRatio: 0.4 }
        ]
    },
    "Modern Standard": {
        name: "Modern Standard Set",
        description: "Current-era Pokemon TCG booster pack",
        packPrice: 3.99,
        pullRates: {
            secretRare: { chance: 0.02, averageValue: 80, maxValue: 300 },
            ultraRare: { chance: 0.10, averageValue: 25, maxValue: 100 },
            holoRare: { chance: 0.33, averageValue: 3, maxValue: 15 },
            reverseHolo: { chance: 1.0, averageValue: 0.5, maxValue: 5 },
            common: { chance: 1.0, averageValue: 0.10, maxValue: 1 }
        },
        expectedValue: 3.25,
        variance: 12.5,
        notes: [
            "Guaranteed reverse holo slot",
            "Higher variance due to secret rares",
            "More special rarity slots than vintage"
        ]
    },
    "Premium Set": {
        name: "Premium/Special Set",
        description: "Higher-end Pokemon TCG product",
        packPrice: 7.99,
        pullRates: {
            secretRare: { chance: 0.05, averageValue: 100, maxValue: 400 },
            ultraRare: { chance: 0.20, averageValue: 30, maxValue: 120 },
            holoRare: { chance: 1.0, averageValue: 4, maxValue: 20 },
            reverseHolo: { chance: 1.0, averageValue: 0.75, maxValue: 8 }
        },
        expectedValue: 7.15,
        variance: 15.3,
        notes: [
            "Guaranteed holo rare or better",
            "Higher price point but better pulls",
            "Often includes promo cards"
        ]
    },
    "Celebrations": {
        name: "Pokemon Celebrations",
        description: "25th Anniversary Special Set",
        packPrice: 4.99,
        pullRates: {
            classicCollection: { chance: 0.25, averageValue: 35, maxValue: 200 },
            vMax: { chance: 0.15, averageValue: 15, maxValue: 50 },
            fullArt: { chance: 0.20, averageValue: 8, maxValue: 30 },
            holoRare: { chance: 1.0, averageValue: 2, maxValue: 10 }
        },
        expectedValue: 6.25,
        variance: 18.5,
        notes: [
            "Guaranteed holo in every pack",
            "Special Classic Collection subset",
            "Higher pull rates than standard sets"
        ]
    },
    "Crown Zenith": {
        name: "Crown Zenith Elite Trainer Box Pack",
        description: "Special SWSH Era Set",
        packPrice: 5.99,
        pullRates: {
            galarian: { chance: 0.20, averageValue: 40, maxValue: 150 },
            vStar: { chance: 0.15, averageValue: 20, maxValue: 80 },
            vMax: { chance: 0.15, averageValue: 15, maxValue: 60 },
            fullArt: { chance: 0.20, averageValue: 10, maxValue: 40 },
            holoRare: { chance: 1.0, averageValue: 2, maxValue: 8 }
        },
        expectedValue: 7.15,
        variance: 16.8,
        notes: [
            "Galarian Gallery subset",
            "No reverse holo slot",
            "Higher hit rates in ETB packs"
        ]
    },

    // Magic: The Gathering Presets
    "MTG Standard Set": {
        name: "Magic Standard Booster",
        description: "Current Standard-legal booster pack",
        packPrice: 4.99,
        pullRates: {
            mythicRare: { chance: 0.125, averageValue: 15, maxValue: 60 },
            rare: { chance: 0.875, averageValue: 2, maxValue: 15 },
            foil: { chance: 0.33, averageValue: 3, maxValue: 20 },
            uncommon: { chance: 1.0, averageValue: 0.25, maxValue: 2 },
            common: { chance: 1.0, averageValue: 0.10, maxValue: 0.5 }
        },
        expectedValue: 3.45,
        variance: 7.2,
        notes: [
            "1:8 packs contain mythic rare",
            "1:3 packs contain foil of any rarity",
            "15 cards per pack"
        ]
    },
    "MTG Collector Booster": {
        name: "Magic Collector Booster",
        description: "Premium MTG booster with guaranteed foils",
        packPrice: 24.99,
        pullRates: {
            foilMythic: { chance: 0.25, averageValue: 45, maxValue: 200 },
            foilRare: { chance: 1.0, averageValue: 12, maxValue: 50 },
            extendedArt: { chance: 1.0, averageValue: 18, maxValue: 80 },
            showcase: { chance: 1.0, averageValue: 15, maxValue: 60 }
        },
        expectedValue: 22.50,
        variance: 25.4,
        notes: [
            "Multiple guaranteed foil rares",
            "Special art treatments",
            "Collector-exclusive variants"
        ]
    },

    // Yu-Gi-Oh! Presets
    "YGO Core Set": {
        name: "Yu-Gi-Oh! Core Set Booster",
        description: "Standard Yu-Gi-Oh! booster pack",
        packPrice: 4.29,
        pullRates: {
            secretRare: { chance: 0.04, averageValue: 35, maxValue: 150 },
            ultraRare: { chance: 0.18, averageValue: 12, maxValue: 40 },
            superRare: { chance: 0.33, averageValue: 3, maxValue: 15 },
            rare: { chance: 1.0, averageValue: 0.5, maxValue: 5 }
        },
        expectedValue: 3.85,
        variance: 9.8,
        notes: [
            "9 cards per pack",
            "Guaranteed rare or higher",
            "Starlight rares extremely rare"
        ]
    },
    "YGO Ghost From the Past": {
        name: "Ghost From the Past",
        description: "Premium all-foil reprint set",
        packPrice: 19.99,
        pullRates: {
            ghostRare: { chance: 0.08, averageValue: 80, maxValue: 300 },
            prismaticSecret: { chance: 0.25, averageValue: 25, maxValue: 100 },
            ultraRare: { chance: 1.0, averageValue: 8, maxValue: 30 }
        },
        expectedValue: 18.75,
        variance: 22.3,
        notes: [
            "All cards are foil",
            "Ghost rares highly sought after",
            "Guaranteed ultra rares"
        ]
    },

    // Special/Vintage
    "Vintage WOTC": {
        name: "Vintage WOTC Era Pack",
        description: "1999-2003 Pokemon TCG Booster",
        packPrice: 299.99,
        pullRates: {
            holoRare: { chance: 0.33, averageValue: 85, maxValue: 500 },
            rare: { chance: 0.67, averageValue: 15, maxValue: 100 },
            uncommon: { chance: 1.0, averageValue: 3, maxValue: 20 },
            common: { chance: 1.0, averageValue: 1, maxValue: 10 }
        },
        expectedValue: 275.50,
        variance: 125.0,
        notes: [
            "High collector value",
            "Potential for grading",
            "Historical significance"
        ],
        yearReleased: 2000,
        historicalData: [
            { date: "2000", packPrice: 3.99, evRatio: 1.1 },
            { date: "2010", packPrice: 25.00, evRatio: 1.5 },
            { date: "2020", packPrice: 250.00, evRatio: 0.9 },
            { date: "2023", packPrice: 299.99, evRatio: 0.8 }
        ]
    }
};

const PackPresetSelector: React.FC<{
    onSelect: (preset: PackPreset) => void;
}> = ({ onSelect }) => {
    return (
        <Grid container spacing={2}>
            {Object.entries(packPresets).map(([key, preset]) => (
                <Grid item xs={12} md={4} key={key}>
                    <Card 
                        sx={{ 
                            p: 2, 
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)'
                            }
                        }}
                        onClick={() => onSelect(preset)}
                    >
                        <Typography variant="h6" gutterBottom>
                            {preset.name}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                            {preset.description}
                        </Typography>
                        
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Tooltip title="Pack retail price">
                                <Chip 
                                    label={`$${preset.packPrice}`}
                                    color="primary"
                                    size="small"
                                />
                            </Tooltip>
                            <Tooltip title="Expected value per pack">
                                <Chip 
                                    label={`EV: $${preset.expectedValue}`}
                                    color={preset.expectedValue >= preset.packPrice ? 'success' : 'error'}
                                    size="small"
                                />
                            </Tooltip>
                            <Tooltip title="Value variance (higher means more volatile)">
                                <Chip 
                                    label={`±$${preset.variance}`}
                                    color="warning"
                                    size="small"
                                />
                            </Tooltip>
                        </Box>

                        {preset.historicalData && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="textSecondary">
                                    Historical EV Ratio Trend:
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 1
                                }}>
                                    {preset.historicalData.map((data, index) => (
                                        <Tooltip 
                                            key={index}
                                            title={`${data.date}: ${data.evRatio.toFixed(2)}x`}
                                        >
                                            <Box
                                                sx={{
                                                    height: 40,
                                                    width: 8,
                                                    bgcolor: data.evRatio >= 1 ? 'success.main' : 'error.main',
                                                    opacity: 0.6 + (data.evRatio * 0.2),
                                                    borderRadius: 1
                                                }}
                                            />
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            {preset.notes.map((note, index) => (
                                <Typography 
                                    key={index} 
                                    variant="caption" 
                                    display="block"
                                    color="textSecondary"
                                >
                                    • {note}
                                </Typography>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PackPresetSelector;
