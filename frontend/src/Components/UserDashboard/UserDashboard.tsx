import React, { useState } from 'react';
import { 
    Box, 
    Grid, 
    Card, 
    Typography, 
    Tabs, 
    Tab, 
    Button,
    Chip,
    Avatar
} from '@mui/material';
import { 
    ShoppingBag, 
    LocalOffer, 
    Timeline, 
    Favorite,
    Assessment,
    Store
} from '@mui/icons-material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const UserDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [salesHistory, setSalesHistory] = useState<any[]>([]);

    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            {/* User Overview Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ width: 64, height: 64, mr: 2 }} />
                            <Box>
                                <Typography variant="h5">Welcome back, User!</Typography>
                                <Typography color="textSecondary">
                                    Member since {new Date().toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                        
                        {/* Quick Stats */}
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={4}>
                                <Card sx={{ p: 2, textAlign: 'center' }}>
                                    <ShoppingBag color="primary" />
                                    <Typography variant="h6">23</Typography>
                                    <Typography variant="body2">Purchases</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card sx={{ p: 2, textAlign: 'center' }}>
                                    <LocalOffer color="secondary" />
                                    <Typography variant="h6">$1,234</Typography>
                                    <Typography variant="body2">Total Value</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card sx={{ p: 2, textAlign: 'center' }}>
                                    <Timeline color="success" />
                                    <Typography variant="h6">+15%</Typography>
                                    <Typography variant="body2">ROI</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    startIcon={<Store />}
                                    sx={{ mb: 2 }}
                                >
                                    Shop Now
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    startIcon={<Assessment />}
                                    sx={{ mb: 2 }}
                                >
                                    Analytics
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    color="primary"
                                >
                                    Track New Purchase
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Tabs */}
            <Card>
                <Tabs 
                    value={activeTab} 
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Purchase History" icon={<ShoppingBag />} />
                    <Tab label="Watchlist" icon={<Favorite />} />
                    <Tab label="Analytics" icon={<Assessment />} />
                    {/* Add more tabs as needed */}
                </Tabs>

                {/* Purchase History Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={2}>
                        {/* Purchase history items */}
                        {purchaseHistory.map((purchase, index) => (
                            <Grid item xs={12} key={index}>
                                {/* Purchase history card */}
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* Watchlist Tab */}
                <TabPanel value={activeTab} index={1}>
                    <Grid container spacing={2}>
                        {/* Watchlist items */}
                        {watchlist.map((item, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                {/* Watchlist card */}
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* Analytics Tab */}
                <TabPanel value={activeTab} index={2}>
                    {/* Add analytics components */}
                </TabPanel>
            </Card>
        </Box>
    );
};

export default UserDashboard;
