import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    Chip,
    Button,
    Tooltip,
    IconButton,
    LinearProgress
} from '@mui/material';
import {
    Timeline,
    TrendingUp,
    PieChart,
    LocalOffer,
    Grade,
    Category,
    Info
} from '@mui/icons-material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

interface CollectionStats {
    totalValue: number;
    totalCards: number;
    uniqueCards: number;
    valueByRarity: { [key: string]: number };
    valueBySet: { [key: string]: number };
    priceHistory: {
        date: string;
        value: number;
    }[];
    topCards: {
        name: string;
        value: number;
        percentageOfTotal: number;
    }[];
    gradedStats: {
        totalGraded: number;
        averageGrade: number;
        gradeDistribution: { [key: string]: number };
    };
    setCompletion: {
        setName: string;
        owned: number;
        total: number;
        percentComplete: number;
    }[];
}

const CollectionAnalytics: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');
    const [stats, setStats] = useState<CollectionStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollectionStats();
    }, [timeRange]);

    const fetchCollectionStats = async () => {
        setLoading(true);
        try {
            // Replace with actual API call
            const response = await fetch(`/api/collection/stats?timeRange=${timeRange}`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching collection stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const ValueChangeIndicator: React.FC<{ change: number }> = ({ change }) => (
        <Chip
            label={`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
            color={change >= 0 ? 'success' : 'error'}
            size="small"
            icon={change >= 0 ? <TrendingUp /> : <TrendingUp style={{ transform: 'rotate(180deg)' }} />}
        />
    );

    if (loading || !stats) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Overview Cards */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6">Total Value</Typography>
                                    <Typography variant="h4">${stats.totalValue.toLocaleString()}</Typography>
                                    <ValueChangeIndicator change={5.2} />
                                </Card>
                            </motion.div>
                        </Grid>
                        {/* Add more overview cards */}
                    </Grid>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12}>
                    <Card>
                        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                            <Tab icon={<Timeline />} label="Value History" />
                            <Tab icon={<PieChart />} label="Distribution" />
                            <Tab icon={<Grade />} label="Graded Cards" />
                            <Tab icon={<Category />} label="Set Completion" />
                        </Tabs>

                        {/* Value History Tab */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Line
                                    data={{
                                        labels: stats.priceHistory.map(h => h.date),
                                        datasets: [{
                                            label: 'Collection Value',
                                            data: stats.priceHistory.map(h => h.value),
                                            borderColor: '#2196f3',
                                            fill: true,
                                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'top' },
                                            tooltip: { mode: 'index' }
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {/* Distribution Tab */}
                        {activeTab === 1 && (
                            <Grid container spacing={3} sx={{ p: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6">Value by Rarity</Typography>
                                    <Pie
                                        data={{
                                            labels: Object.keys(stats.valueByRarity),
                                            datasets: [{
                                                data: Object.values(stats.valueByRarity),
                                                backgroundColor: [
                                                    '#FF6384',
                                                    '#36A2EB',
                                                    '#FFCE56',
                                                    '#4BC0C0',
                                                    '#9966FF'
                                                ]
                                            }]
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6">Top Cards by Value</Typography>
                                    {stats.topCards.map((card, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1">
                                                {card.name} - ${card.value.toLocaleString()}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={card.percentageOfTotal}
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        )}

                        {/* Graded Cards Tab */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6">Grade Distribution</Typography>
                                <Bar
                                    data={{
                                        labels: Object.keys(stats.gradedStats.gradeDistribution),
                                        datasets: [{
                                            label: 'Number of Cards',
                                            data: Object.values(stats.gradedStats.gradeDistribution),
                                            backgroundColor: '#2196f3'
                                        }]
                                    }}
                                />
                            </Box>
                        )}

                        {/* Set Completion Tab */}
                        {activeTab === 3 && (
                            <Box sx={{ p: 3 }}>
                                {stats.setCompletion.map((set, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1">
                                            {set.setName} ({set.owned}/{set.total})
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={set.percentComplete}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CollectionAnalytics;
