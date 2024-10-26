import React, { useState } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    Slider,
    Switch,
    Button,
    TextField,
    Paper,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import { EffectManager } from '../effects/EffectManager';
import { extendedRevealSequences } from '../theme/CardRevealSequences';
import { ParticleEffect } from '../effects/ParticleSystem';

interface DebugState {
    effectIntensity: number;
    soundEnabled: boolean;
    hapticEnabled: boolean;
    currentSequence: string;
    isPlaying: boolean;
    logs: string[];
}

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [debugState, setDebugState] = useState<DebugState>({
        effectIntensity: 1,
        soundEnabled: true,
        hapticEnabled: true,
        currentSequence: 'mythicRainbow',
        isPlaying: false,
        logs: []
    });

    const effectManager = EffectManager.getInstance();

    const addLog = (message: string) => {
        setDebugState(prev => ({
            ...prev,
            logs: [`${new Date().toISOString()} - ${message}`, ...prev.logs.slice(0, 99)]
        }));
    };

    const handleEffectTest = async (effectName: string) => {
        addLog(`Testing effect: ${effectName}`);
        try {
            await effectManager.playEffectSequence(effectName);
            addLog(`Effect ${effectName} completed successfully`);
        } catch (error) {
            addLog(`Error in effect ${effectName}: ${error}`);
        }
    };

    const handleSequenceTest = async () => {
        setDebugState(prev => ({ ...prev, isPlaying: true }));
        addLog('Starting sequence test');
        
        try {
            for (const [name, sequence] of Object.entries(extendedRevealSequences)) {
                addLog(`Testing sequence: ${name}`);
                await effectManager.playEffectSequence(name);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            addLog(`Sequence test error: ${error}`);
        }
        
        setDebugState(prev => ({ ...prev, isPlaying: false }));
        addLog('Sequence test completed');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Effect System Debug Panel
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                    <Tab label="Effect Testing" />
                    <Tab label="Performance" />
                    <Tab label="System Logs" />
                </Tabs>
            </Paper>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Effect Controls
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography>Effect Intensity</Typography>
                                <Slider
                                    value={debugState.effectIntensity}
                                    onChange={(_, value) => setDebugState(prev => ({
                                        ...prev,
                                        effectIntensity: value as number
                                    }))}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    marks
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography>Sound Effects</Typography>
                                <Switch
                                    checked={debugState.soundEnabled}
                                    onChange={(e) => setDebugState(prev => ({
                                        ...prev,
                                        soundEnabled: e.target.checked
                                    }))}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography>Haptic Feedback</Typography>
                                <Switch
                                    checked={debugState.hapticEnabled}
                                    onChange={(e) => setDebugState(prev => ({
                                        ...prev,
                                        hapticEnabled: e.target.checked
                                    }))}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                onClick={handleSequenceTest}
                                disabled={debugState.isPlaying}
                            >
                                Test All Sequences
                            </Button>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Effect Preview
                            </Typography>
                            <Box
                                sx={{
                                    height: 300,
                                    border: '1px solid #eee',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <ParticleEffect
                                    count={1000}
                                    color="#ff0000"
                                    size={2}
                                    speed={1}
                                    spread={10}
                                />
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                System Logs
                            </Typography>
                            <Box
                                sx={{
                                    maxHeight: 300,
                                    overflow: 'auto',
                                    fontFamily: 'monospace',
                                    fontSize: '0.9em',
                                    bgcolor: '#f5f5f5',
                                    p: 2,
                                    borderRadius: 1
                                }}
                            >
                                {debugState.logs.map((log, index) => (
                                    <Box key={index} sx={{ mb: 0.5 }}>
                                        {log}
                                    </Box>
                                ))}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Performance Metrics
                    </Typography>
                    {/* Add performance monitoring components */}
                </Card>
            )}

            {activeTab === 2 && (
                <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        System Logs
                    </Typography>
                    {/* Add detailed logging interface */}
                </Card>
            )}
        </Box>
    );
};

export default AdminDashboard;
