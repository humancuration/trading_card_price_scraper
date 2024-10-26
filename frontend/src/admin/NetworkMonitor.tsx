import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow,
    Chip,
    Collapse,
    IconButton
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface NetworkRequest {
    id: string;
    url: string;
    method: string;
    status: number;
    duration: number;
    timestamp: number;
    size: number;
    type: string;
    details?: any;
}

const NetworkMonitor: React.FC = () => {
    const [requests, setRequests] = useState<NetworkRequest[]>([]);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        // Create a proxy for fetch
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const request = args[0] as Request | string;
            const url = typeof request === 'string' ? request : request.url;
            const method = typeof request === 'string' ? 'GET' : request.method;

            try {
                const response = await originalFetch(...args);
                const duration = performance.now() - startTime;
                const clone = response.clone();
                const body = await clone.text();
                
                const requestData: NetworkRequest = {
                    id: Math.random().toString(36).substr(2, 9),
                    url,
                    method,
                    status: response.status,
                    duration,
                    timestamp: Date.now(),
                    size: body.length,
                    type: response.headers.get('content-type') || 'unknown',
                    details: {
                        headers: Object.fromEntries(response.headers.entries()),
                        body: body.substring(0, 1000) + (body.length > 1000 ? '...' : '')
                    }
                };

                setRequests(prev => [requestData, ...prev].slice(0, 100));
                return response;
            } catch (error) {
                const requestData: NetworkRequest = {
                    id: Math.random().toString(36).substr(2, 9),
                    url,
                    method,
                    status: 0,
                    duration: performance.now() - startTime,
                    timestamp: Date.now(),
                    size: 0,
                    type: 'error',
                    details: { error }
                };
                setRequests(prev => [requestData, ...prev].slice(0, 100));
                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const getStatusColor = (status: number) => {
        if (status === 0) return 'error';
        if (status < 300) return 'success';
        if (status < 400) return 'warning';
        return 'error';
    };

    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Network Requests
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>URL</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((request) => (
                        <React.Fragment key={request.id}>
                            <TableRow 
                                hover
                                sx={{ 
                                    '&:hover': { 
                                        bgcolor: 'action.hover',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                <TableCell>
                                    {new Date(request.timestamp).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={request.method}
                                        size="small"
                                        color={request.method === 'GET' ? 'primary' : 'secondary'}
                                    />
                                </TableCell>
                                <TableCell>{new URL(request.url).pathname}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={request.status}
                                        size="small"
                                        color={getStatusColor(request.status)}
                                    />
                                </TableCell>
                                <TableCell>
                                    {request.duration.toFixed(2)}ms
                                </TableCell>
                                <TableCell>
                                    {(request.size / 1024).toFixed(2)}KB
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => setExpandedRow(
                                            expandedRow === request.id ? null : request.id
                                        )}
                                    >
                                        {expandedRow === request.id ? 
                                            <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={7} sx={{ py: 0 }}>
                                    <Collapse 
                                        in={expandedRow === request.id} 
                                        timeout="auto" 
                                        unmountOnExit
                                    >
                                        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Headers
                                            </Typography>
                                            <pre>
                                                {JSON.stringify(
                                                    request.details?.headers, 
                                                    null, 
                                                    2
                                                )}
                                            </pre>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Response Preview
                                            </Typography>
                                            <pre>
                                                {request.details?.body}
                                            </pre>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default NetworkMonitor;
