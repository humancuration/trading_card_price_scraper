import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    Typography, 
    LinearProgress, 
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider 
} from '@mui/material';
import { Line } from 'react-chartjs-2';

interface PerformanceMetrics {
    fps: number;
    memory: {
        used: number;
        total: number;
    };
    loadTime: number;
    activeEffects: number;
    renderTime: number;
}

const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        memory: { used: 0, total: 0 },
        loadTime: 0,
        activeEffects: 0,
        renderTime: 0
    });

    const [history, setHistory] = useState<{
        timestamps: number[];
        fps: number[];
        memory: number[];
        renderTime: number[];
    }>({
        timestamps: [],
        fps: [],
        memory: [],
        renderTime: []
    });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            const now = performance.now();
            frameCount++;
            
            if (now - lastTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / (now - lastTime));
                const memory = performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576)
                } : metrics.memory;

                setMetrics(prev => ({
                    ...prev,
                    fps,
                    memory,
                    activeEffects: document.querySelectorAll('.effect-container').length,
                    renderTime: performance.now() - now
                }));

                setHistory(prev => ({
                    timestamps: [...prev.timestamps, now].slice(-60),
                    fps: [...prev.fps, fps].slice(-60),
                    memory: [...prev.memory, memory.used].slice(-60),
                    renderTime: [...prev.renderTime, performance.now() - now].slice(-60)
                }));

                frameCount = 0;
                lastTime = now;
            }
            
            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }, []);

    const chartData = {
        labels: history.timestamps.map(t => new Date(t).toLocaleTimeString()),
        datasets: [
            {
                label: 'FPS',
                data: history.fps,
                borderColor: '#2196f3',
                fill: false
            },
            {
                label: 'Memory (MB)',
                data: history.memory,
                borderColor: '#4caf50',
                fill: false
            },
            {
                label: 'Render Time (ms)',
                data: history.renderTime,
                borderColor: '#ff9800',
                fill: false
            }
        ]
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Real-time Performance Metrics
                    </Typography>
                    <Box sx={{ height: 300 }}>
                        <Line 
                            data={chartData}
                            options={{
                                animation: false,
                                scales: {
                                    y: { beginAtZero: true }
                                }
                            }}
                        />
                    </Box>
                </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Current Stats
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText 
                                primary="FPS"
                                secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={metrics.fps / 60 * 100}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                        />
                                        {metrics.fps}
                                    </Box>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText 
                                primary="Memory Usage"
                                secondary={`${metrics.memory.used}MB / ${metrics.memory.total}MB`}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText 
                                primary="Active Effects"
                                secondary={metrics.activeEffects}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText 
                                primary="Render Time"
                                secondary={`${metrics.renderTime.toFixed(2)}ms`}
                            />
                        </ListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PerformanceMonitor;
