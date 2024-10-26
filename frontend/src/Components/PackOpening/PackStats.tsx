import React from 'react';
import { Card, Typography, Box, Tooltip } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';

interface PackStats {
    totalPacks: number;
    totalValue: number;
    rarityDistribution: {
        [key: string]: number;
    };
    bestPulls: {
        card: string;
        rarity: string;
        value: number;
    }[];
    expectedValue: number;
    actualValue: number;
    variance: number;
}

const PackStats: React.FC<{ stats: PackStats }> = ({ stats }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Pack Opening Statistics
            </Typography>
            
            {/* Value Analysis */}
            <Card sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Value Analysis</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Average value per pack">
                        <Box>
                            <Typography color="text.secondary">Avg. Value/Pack</Typography>
                            <Typography variant="h4">
                                ${(stats.totalValue / stats.totalPacks).toFixed(2)}
                            </Typography>
                        </Box>
                    </Tooltip>
                    <Tooltip title="Expected vs Actual Value">
                        <Box>
                            <Typography color="text.secondary">Value Variance</Typography>
                            <Typography 
                                variant="h4"
                                color={stats.variance >= 0 ? 'success.main' : 'error.main'}
                            >
                                {stats.variance >= 0 ? '+' : ''}{stats.variance.toFixed(2)}%
                            </Typography>
                        </Box>
                    </Tooltip>
                </Box>
            </Card>

            {/* Rarity Distribution */}
            <Card sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Pull Rates</Typography>
                <Box sx={{ height: 300 }}>
                    <Pie 
                        data={{
                            labels: Object.keys(stats.rarityDistribution),
                            datasets: [{
                                data: Object.values(stats.rarityDistribution),
                                backgroundColor: [
                                    '#9e9e9e', // Common
                                    '#4caf50', // Uncommon
                                    '#2196f3', // Rare
                                    '#9c27b0', // Ultra Rare
                                    '#f44336'  // Secret Rare
                                ]
                            }]
                        }}
                        options={{
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const value = context.raw as number;
                                            return `${(value * 100).toFixed(2)}%`;
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </Box>
            </Card>

            {/* Best Pulls */}
            <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Best Pulls</Typography>
                {stats.bestPulls.map((pull, index) => (
                    <Box 
                        key={index} 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            boxShadow: 1
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1">{pull.card}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {pull.rarity}
                            </Typography>
                        </Box>
                        <Typography 
                            variant="h6" 
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            ${pull.value.toFixed(2)}
                        </Typography>
                    </Box>
                ))}
            </Card>

            {/* Educational Tips */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="subtitle1" color="info.contrastText">
                    Did you know?
                </Typography>
                <Typography variant="body2" color="info.contrastText">
                    The expected value of a pack is calculated based on current market prices
                    and official pull rates. This helps understand the actual value proposition
                    of buying packs versus buying singles!
                </Typography>
            </Box>
        </Box>
    );
};

export default PackStats;
