import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    Grid, 
    Typography,
    CircularProgress,
    Alert,
    AlertTitle,
    Tooltip
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

interface MetricAlert {
    type: 'error' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
}

interface PerformanceData {
    fps: number[];
    memory: number[];
    apiLatency: number[];
    errorRate: number[];
    activeUsers: number;
    requestsPerMinute: number;
    cacheHitRate: number;
    timestamps: string[];
}

const PerformanceMetrics: React.FC = () => {
    const [performanceData, setPerformanceData] = useState<PerformanceData>({
        fps: [],
        memory: [],
        apiLatency: [],
        errorRate: [],
        activeUsers: 0,
        requestsPerMinute: 0,
        cacheHitRate: 0,
        timestamps: []
    });
    const [alerts, setAlerts] = useState<MetricAlert[]>([]);

    useEffect(() => {
        // Set up real-time monitoring
        const interval = setInterval(gatherMetrics, 1000);
        return () => clearInterval(interval);
    }, []);

    const gatherMetrics = () => {
        // Simulate gathering metrics (replace with real metrics in production)
        const now = new Date();
        const timestamp = now.toLocaleTimeString();

        setPerformanceData(prev => {
            const newData = {
                fps: [...prev.fps, Math.random() * 60],
                memory: [...prev.memory, Math.random() * 1000],
                apiLatency: [...prev.apiLatency, Math.random() * 500],
                errorRate: [...prev.errorRate, Math.random() * 5],
                activeUsers: Math.floor(Math.random() * 100),
                requestsPerMinute: Math.floor(Math.random() * 1000),
                cacheHitRate: Math.random() * 100,
                timestamps: [...prev.timestamps, timestamp]
            };

            // Keep only last 60 data points
            Object.keys(newData).forEach(key => {
                if (Array.isArray(newData[key]) && newData[key].length > 60) {
                    newData[key] = newData[key].slice(-60);
                }
            });

            // Check for alerts
            if (newData.errorRate[newData.errorRate.length - 1] > 3) {
                setAlerts(prev => [{
                    type: 'error',
                    title: 'High Error Rate',
                    message: 'Error rate exceeded threshold of 3%',
                    timestamp: now
                }, ...prev]);
            }

            if (newData.apiLatency[newData.apiLatency.length - 1] > 400) {
                setAlerts(prev => [{
                    type: 'warning',
                    title: 'High Latency',
                    message: 'API latency exceeded 400ms',
                    timestamp: now
                }, ...prev]);
            }

            return newData;
        });
    };

    const chartOptions = {
        responsive: true,
        animation: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                position: 'top' as const
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Real-time Metrics */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Real-time Performance
                        </Typography>
                        <Line
                            data={{
                                labels: performanceData.timestamps,
                                datasets: [
                                    {
                                        label: 'FPS',
                                        data: performanceData.fps,
                                        borderColor: '#4caf50',
                                        fill: false
                                    },
                                    {
                                        label: 'API Latency (ms)',
                                        data: performanceData.apiLatency,
                                        borderColor: '#2196f3',
                                        fill: false
                                    }
                                ]
                            }}
                            options={chartOptions}
                        />
                    </Card>
                </Grid>

                {/* Current Stats */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Current Stats
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Tooltip title="Active users in the last minute">
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4">
                                            {performanceData.activeUsers}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Active Users
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={6}>
                                <Tooltip title="Requests per minute">
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4">
                                            {performanceData.requestsPerMinute}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Requests/min
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title="Cache hit rate">
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4">
                                            {performanceData.cacheHitRate.toFixed(1)}%
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Cache Hit Rate
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* Error Rate */}
                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Error Rate
                        </Typography>
                        <Bar
                            data={{
                                labels: performanceData.timestamps,
                                datasets: [{
                                    label: 'Error Rate (%)',
                                    data: performanceData.errorRate,
                                    backgroundColor: '#f44336',
                                    borderColor: '#d32f2f',
                                    borderWidth: 1
                                }]
                            }}
                            options={chartOptions}
                        />
                    </Card>
                </Grid>

                {/* Alerts */}
                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Alerts
                        </Typography>
                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {alerts.map((alert, index) => (
                                <Alert 
                                    key={index} 
                                    severity={alert.type}
                                    sx={{ mb: 1 }}
                                >
                                    <AlertTitle>{alert.title}</AlertTitle>
                                    {alert.message}
                                    <Typography variant="caption" display="block">
                                        {alert.timestamp.toLocaleString()}
                                    </Typography>
                                </Alert>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PerformanceMetrics;
