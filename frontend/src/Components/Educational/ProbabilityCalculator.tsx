import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    Slider,
    TextField,
    Button,
    Tooltip,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import { Line, Pie } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

interface SimulationResult {
    packsOpened: number;
    totalSpent: number;
    totalValue: number;
    roi: number;
    hits: {
        secretRare: number;
        ultraRare: number;
        rare: number;
    };
    bestPull: {
        name: string;
        value: number;
        packNumber: number;
    };
}

interface PullRates {
    [key: string]: {
        chance: number;
        averageValue: number;
        maxValue: number;
    };
}

const ProbabilityCalculator: React.FC = () => {
    const [packPrice, setPackPrice] = useState(4.99);
    const [numPacks, setNumPacks] = useState(36); // Default booster box
    const [simulations, setSimulations] = useState<SimulationResult[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [targetCard, setTargetCard] = useState<string>('');
    const [targetCardOdds, setTargetCardOdds] = useState<number>(0);

    // Example pull rates (can be fetched from API)
    const pullRates: PullRates = {
        secretRare: { chance: 0.02, averageValue: 80, maxValue: 300 },
        ultraRare: { chance: 0.10, averageValue: 25, maxValue: 100 },
        rare: { chance: 1.0, averageValue: 3, maxValue: 15 },
        reverseHolo: { chance: 1.0, averageValue: 1, maxValue: 5 },
        common: { chance: 1.0, averageValue: 0.25, maxValue: 2 }
    };

    const runSimulation = () => {
        setIsSimulating(true);
        const results: SimulationResult[] = [];

        // Run multiple simulations for statistical significance
        for (let sim = 0; sim < 1000; sim++) {
            let result: SimulationResult = {
                packsOpened: numPacks,
                totalSpent: numPacks * packPrice,
                totalValue: 0,
                roi: 0,
                hits: {
                    secretRare: 0,
                    ultraRare: 0,
                    rare: 0
                },
                bestPull: {
                    name: '',
                    value: 0,
                    packNumber: 0
                }
            };

            // Simulate opening each pack
            for (let pack = 1; pack <= numPacks; pack++) {
                let packValue = 0;

                // Check for each rarity
                Object.entries(pullRates).forEach(([rarity, { chance, averageValue, maxValue }]) => {
                    if (Math.random() <= chance) {
                        // Add some variance to card values
                        const value = averageValue * (0.5 + Math.random());
                        packValue += value;

                        // Track hits
                        if (rarity in result.hits) {
                            result.hits[rarity as keyof typeof result.hits]++;
                        }

                        // Track best pull
                        if (value > result.bestPull.value) {
                            result.bestPull = {
                                name: `${rarity} Card`,
                                value,
                                packNumber: pack
                            };
                        }
                    }
                });

                result.totalValue += packValue;
            }

            result.roi = ((result.totalValue - result.totalSpent) / result.totalSpent) * 100;
            results.push(result);
        }

        setSimulations(results);
        setIsSimulating(false);
    };

    const calculateTargetCardOdds = () => {
        if (!targetCard) return;

        // Example calculation for specific card
        const cardsPerSet = 200; // Example set size
        const copiesInSet = 1; // Usually 1 for rare cards
        const pullRate = pullRates.ultraRare.chance; // Assuming it's an ultra rare

        // Probability of pulling specific card in one pack
        const singlePackOdds = (pullRate * copiesInSet) / cardsPerSet;

        // Probability of pulling in N packs
        const oddsInNPacks = 1 - Math.pow(1 - singlePackOdds, numPacks);
        setTargetCardOdds(oddsInNPacks * 100);
    };

    const getStatistics = () => {
        if (simulations.length === 0) return null;

        const avgROI = simulations.reduce((sum, sim) => sum + sim.roi, 0) / simulations.length;
        const profitableRuns = simulations.filter(sim => sim.roi > 0).length;
        const profitablePercentage = (profitableRuns / simulations.length) * 100;

        return {
            avgROI,
            profitablePercentage,
            avgSecretRares: simulations.reduce((sum, sim) => sum + sim.hits.secretRare, 0) / simulations.length,
            avgUltraRares: simulations.reduce((sum, sim) => sum + sim.hits.ultraRare, 0) / simulations.length,
            avgValue: simulations.reduce((sum, sim) => sum + sim.totalValue, 0) / simulations.length
        };
    };

    const stats = getStatistics();

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Input Controls */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Simulation Settings
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography>Pack Price ($)</Typography>
                            <TextField
                                type="number"
                                value={packPrice}
                                onChange={(e) => setPackPrice(Number(e.target.value))}
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography>Number of Packs</Typography>
                            <Slider
                                value={numPacks}
                                onChange={(_, value) => setNumPacks(value as number)}
                                min={1}
                                max={360}
                                marks={[
                                    { value: 1, label: '1' },
                                    { value: 36, label: 'Box' },
                                    { value: 360, label: 'Case' }
                                ]}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            onClick={runSimulation}
                            disabled={isSimulating}
                            fullWidth
                        >
                            Run Simulation
                        </Button>
                    </Card>
                </Grid>

                {/* Results Display */}
                {stats && (
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Simulation Results
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography color="textSecondary">Average ROI</Typography>
                                        <Typography variant="h4" color={stats.avgROI >= 0 ? 'success.main' : 'error.main'}>
                                            {stats.avgROI.toFixed(2)}%
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography color="textSecondary">Profitable Openings</Typography>
                                        <Typography variant="h4">
                                            {stats.profitablePercentage.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Average Pulls per {numPacks} packs:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip 
                                    label={`Secret Rares: ${stats.avgSecretRares.toFixed(2)}`}
                                    color="error"
                                />
                                <Chip 
                                    label={`Ultra Rares: ${stats.avgUltraRares.toFixed(2)}`}
                                    color="primary"
                                />
                            </Box>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">
                                    Expected Value per Pack: ${(stats.avgValue / numPacks).toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    Cost per Pack: ${packPrice.toFixed(2)}
                                </Typography>
                            </Alert>
                        </Card>
                    </Grid>
                )}

                {/* Distribution Charts */}
                {simulations.length > 0 && (
                    <Grid item xs={12}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                ROI Distribution
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Line
                                    data={{
                                        labels: simulations.map((_, i) => i + 1).filter((_, i) => i % 50 === 0),
                                        datasets: [{
                                            label: 'ROI %',
                                            data: simulations.map(sim => sim.roi).filter((_, i) => i % 50 === 0),
                                            borderColor: '#2196f3',
                                            fill: true,
                                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'ROI Distribution across Simulations'
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ProbabilityCalculator;
