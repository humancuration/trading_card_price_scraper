import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    Typography, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl,
    InputLabel,
    IconButton,
    Chip,
    Stack,
    Button
} from '@mui/material';
import { 
    FilterList, 
    Download, 
    Clear, 
    Error, 
    Warning, 
    Info, 
    CheckCircle 
} from '@mui/icons-material';

interface LogEntry {
    timestamp: string;
    level: 'error' | 'warning' | 'info' | 'success';
    category: string;
    message: string;
    details?: any;
}

const LoggingSystem: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState({
        level: 'all',
        category: 'all',
        search: ''
    });

    const [categories, setCategories] = useState<string[]>([
        'effect-system',
        'performance',
        'user-interaction',
        'network',
        'rendering'
    ]);

    useEffect(() => {
        // Subscribe to global error events
        const handleError = (error: ErrorEvent) => {
            addLog({
                level: 'error',
                category: 'system',
                message: error.message,
                details: {
                    stack: error.error?.stack,
                    filename: error.filename,
                    lineno: error.lineno
                }
            });
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    const addLog = (entry: Omit<LogEntry, 'timestamp'>) => {
        setLogs(prev => [{
            ...entry,
            timestamp: new Date().toISOString()
        }, ...prev]);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const downloadLogs = () => {
        const content = JSON.stringify(logs, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredLogs = logs.filter(log => {
        if (filter.level !== 'all' && log.level !== filter.level) return false;
        if (filter.category !== 'all' && log.category !== filter.category) return false;
        if (filter.search && !log.message.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'error': return <Error color="error" />;
            case 'warning': return <Warning color="warning" />;
            case 'info': return <Info color="info" />;
            case 'success': return <CheckCircle color="success" />;
            default: return null;
        }
    };

    return (
        <Card sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">System Logs</Typography>
                <Stack direction="row" spacing={1}>
                    <Button 
                        startIcon={<Download />}
                        onClick={downloadLogs}
                        variant="outlined"
                    >
                        Export
                    </Button>
                    <Button 
                        startIcon={<Clear />}
                        onClick={clearLogs}
                        variant="outlined"
                        color="error"
                    >
                        Clear
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Level</InputLabel>
                    <Select
                        value={filter.level}
                        label="Level"
                        onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="error">Error</MenuItem>
                        <MenuItem value="warning">Warning</MenuItem>
                        <MenuItem value="info">Info</MenuItem>
                        <MenuItem value="success">Success</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={filter.category}
                        label="Category"
                        onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {categories.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    placeholder="Search logs..."
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    sx={{ flexGrow: 1 }}
                />
            </Box>

            <Box 
                sx={{ 
                    maxHeight: 500, 
                    overflow: 'auto',
                    bgcolor: '#f8f9fa',
                    borderRadius: 1,
                    p: 2
                }}
            >
                {filteredLogs.map((log, index) => (
                    <Box 
                        key={index}
                        sx={{ 
                            mb: 1, 
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1
                        }}
                    >
                        {getLevelIcon(log.level)}
                        <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(log.timestamp).toLocaleString()}
                                </Typography>
                                <Chip 
                                    label={log.category}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            <Typography>{log.message}</Typography>
                            {log.details && (
                                <Box 
                                    component="pre"
                                    sx={{ 
                                        mt: 1,
                                        p: 1,
                                        bgcolor: '#f5f5f5',
                                        borderRadius: 1,
                                        fontSize: '0.875rem',
                                        overflow: 'auto'
                                    }}
                                >
                                    {JSON.stringify(log.details, null, 2)}
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Card>
    );
};

export default LoggingSystem;
