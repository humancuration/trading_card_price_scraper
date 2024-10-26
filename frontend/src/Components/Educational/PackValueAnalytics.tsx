import React from 'react';
import { 
    Card, 
    Typography, 
    Box, 
    Grid, 
    Tooltip, 
    Button,
    Alert,
    Divider 
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

interface PackAnalytics {
    packPrice: number;
    expectedValue: number;
    historicalEV: {
        date: string;
        value: number;
    }[];
    pullRates: {
        rarity: string;
        chance: number;
        averageValue: number;
    }[];
    bestPossiblePulls: {
        cardName: string;
        rarity: string;
        currentPrice: number;
        historicalHigh: number;
    }[];
    realisticScenarios: {
        outcome: string;
        probability: number;
        value: number;
        description: string;
    }[];
}

const PackValueAnalytics: React.FC<{ setData: string }> = ({ setData }) => {
    const [analytics, setAnalytics] = React.useState<PackAnalytics | null>(null);
    const [showRealistic, setShowRealistic] = React.useState(false);

    // Educational tooltips
    const tooltips = {
        ev: "Expected Value is the average return you might get from opening a pack, based on current market prices and pull rates.",
        variance: "Variance shows how much actual results might differ from the expected value.",
        historical: "Historical trends help understand how pack values change over time.",
        realistic: "Real-world scenarios show the most common outcomes when opening packs."
    };

    // Add this type guard function near the top of the component
    const isBestPull = (item: any): item is PackAnalytics['bestPossiblePulls'][0] => {
        return 'cardName' in item;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Quick Stats Overview */}
                <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Understanding pack value helps make informed decisions about buying packs vs. singles.
                    </Alert>
                </Grid>

                {/* EV vs Pack Price */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Pack Value Analysis
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                                <Typography color="textSecondary">Pack Price</Typography>
                                <Typography variant="h4">${analytics?.packPrice}</Typography>
                            </Box>
                            <Box>
                                <Tooltip title={tooltips.ev}>
                                    <Typography color="textSecondary">Expected Value</Typography>
                                </Tooltip>
                                <Typography 
                                    variant="h4" 
                                    color={(analytics?.expectedValue ?? 0) > (analytics?.packPrice ?? 0) ? 'success.main' : 'error.main'}
                                >
                                    ${analytics?.expectedValue}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                            {(analytics?.expectedValue ?? 0) > (analytics?.packPrice ?? 0)
                                ? "Positive expected value, but consider variance and liquidity."
                                : "Negative expected value - buying singles might be more cost-effective."}
                        </Typography>
                    </Card>
                </Grid>

                {/* Historical Trends */}
                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Historical Expected Value
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Line 
                                data={{
                                    labels: analytics?.historicalEV.map(h => h.date),
                                    datasets: [{
                                        label: 'Pack EV',
                                        data: analytics?.historicalEV.map(h => h.value),
                                        borderColor: '#2196f3',
                                        fill: true,
                                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                    }, {
                                        label: 'Pack Price',
                                        data: analytics?.historicalEV.map(() => analytics.packPrice),
                                        borderColor: '#ff9800',
                                        borderDash: [5, 5]
                                    }]
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>

                {/* Realistic Scenarios */}
                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Realistic Scenarios</Typography>
                            <Button 
                                variant="outlined"
                                onClick={() => setShowRealistic(!showRealistic)}
                            >
                                {showRealistic ? "Show Exciting Pulls" : "Show Realistic Outcomes"}
                            </Button>
                        </Box>
                        
                        <Grid container spacing={2}>
                            {(showRealistic ? analytics?.realisticScenarios : analytics?.bestPossiblePulls)?.map((item, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card sx={{ p: 2, height: '100%' }}>
                                            {isBestPull(item) ? (
                                                <>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {item.cardName}
                                                    </Typography>
                                                    <Typography color="textSecondary" variant="body2">
                                                        {item.rarity}
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        ${item.currentPrice.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Historical High: ${item.historicalHigh.toFixed(2)}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {item.outcome}
                                                    </Typography>
                                                    <Typography color="textSecondary" variant="body2">
                                                        {'probability' in item && `Probability: ${(item.probability * 100).toFixed(2)}%`}
                                                    </Typography>
                                                    <Typography variant="h6" color={'value' in item && (item.value ?? 0) > (analytics?.packPrice ?? 0) ? 'success.main' : 'error.main'}>
                                                        ${('value' in item ? item.value : 0).toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                                        {'description' in item ? item.description : ''}
                                                    </Typography>
                                                </>
                                            )}
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>

                {/* Educational Tips */}
                <Grid item xs={12}>
                    <Alert severity="info">
                        <Typography variant="subtitle1" gutterBottom>
                            Key Takeaways:
                        </Typography>
                        <ul>
                            <li>Pack opening can be exciting but is generally a form of gambling</li>
                            <li>Most packs will return less than their purchase price</li>
                            <li>Consider buying singles for collecting specific cards</li>
                            <li>If you enjoy opening packs, set a budget and understand the risks</li>
                        </ul>
                    </Alert>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PackValueAnalytics;
