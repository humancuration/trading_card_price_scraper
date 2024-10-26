import React, { useState } from 'react';
import { 
    Card, 
    Grid, 
    Typography, 
    Button, 
    Chip,
    Dialog,
    Box,
    Rating,
    TextField
} from '@mui/material';
import { Store, LocalOffer, Assessment, Timeline } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ShopPurchase {
    shopName: string;
    purchaseDate: Date;
    productType: string;
    price: number;
    pulls: CardPull[];
    rating: number;
    notes?: string;
    affiliateLink?: string;
}

interface CardPull {
    cardName: string;
    rarity: string;
    condition: string;
    marketValue: number;
}

interface ShopStats {
    totalSpent: number;
    totalValue: number;
    bestPull: CardPull;
    pullRates: {
        [key: string]: number;  // rarity: percentage
    };
}

const ShopPurchaseTracker: React.FC = () => {
    const [purchases, setPurchases] = useState<ShopPurchase[]>([]);
    const [shopStats, setShopStats] = useState<Map<string, ShopStats>>(new Map());
    const [showAddDialog, setShowAddDialog] = useState(false);

    const calculateROI = (purchase: ShopPurchase) => {
        const totalValue = purchase.pulls.reduce((sum, pull) => sum + pull.marketValue, 0);
        return ((totalValue - purchase.price) / purchase.price) * 100;
    };

    const updateShopStats = (shopName: string, purchase: ShopPurchase) => {
        const currentStats = shopStats.get(shopName) || {
            totalSpent: 0,
            totalValue: 0,
            bestPull: purchase.pulls[0],
            pullRates: {}
        };

        // Update totals
        currentStats.totalSpent += purchase.price;
        const purchaseValue = purchase.pulls.reduce((sum, pull) => sum + pull.marketValue, 0);
        currentStats.totalValue += purchaseValue;

        // Update best pull
        const newBestPull = purchase.pulls.reduce((best, current) => 
            current.marketValue > best.marketValue ? current : best
        , currentStats.bestPull);
        currentStats.bestPull = newBestPull;

        // Update pull rates
        purchase.pulls.forEach(pull => {
            currentStats.pullRates[pull.rarity] = (currentStats.pullRates[pull.rarity] || 0) + 1;
        });

        shopStats.set(shopName, currentStats);
        setShopStats(new Map(shopStats));
    };

    return (
        <div className="shop-tracker">
            <Grid container spacing={3}>
                {/* Shop Performance Overview */}
                <Grid item xs={12}>
                    <Card className="stats-card">
                        <Typography variant="h5">Shop Performance</Typography>
                        <Grid container spacing={2}>
                            {Array.from(shopStats.entries()).map(([shop, stats]) => (
                                <Grid item xs={12} md={4} key={shop}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="shop-stats"
                                    >
                                        <Typography variant="h6">{shop}</Typography>
                                        <Box className="stat-row">
                                            <LocalOffer />
                                            <Typography>
                                                ROI: {((stats.totalValue - stats.totalSpent) / stats.totalSpent * 100).toFixed(2)}%
                                            </Typography>
                                        </Box>
                                        <Box className="stat-row">
                                            <Assessment />
                                            <Typography>
                                                Best Pull: {stats.bestPull.cardName} (${stats.bestPull.marketValue})
                                            </Typography>
                                        </Box>
                                        <Box className="pull-rates">
                                            {Object.entries(stats.pullRates).map(([rarity, count]) => (
                                                <Chip 
                                                    key={rarity}
                                                    label={`${rarity}: ${count}`}
                                                    size="small"
                                                    color={rarity.includes('Secret') ? 'error' : 'primary'}
                                                />
                                            ))}
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>

                {/* Recent Purchases */}
                <Grid item xs={12}>
                    <Card className="purchases-card">
                        <Typography variant="h5">Recent Purchases</Typography>
                        <Grid container spacing={2}>
                            {purchases.map((purchase, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="purchase-item"
                                    >
                                        <Box className="purchase-header">
                                            <Typography variant="h6">{purchase.shopName}</Typography>
                                            <Rating value={purchase.rating} readOnly />
                                        </Box>
                                        <Box className="purchase-details">
                                            <Typography>
                                                {purchase.productType} - ${purchase.price}
                                            </Typography>
                                            <Typography color={calculateROI(purchase) >= 0 ? 'success' : 'error'}>
                                                ROI: {calculateROI(purchase).toFixed(2)}%
                                            </Typography>
                                        </Box>
                                        <Box className="pulls-preview">
                                            {purchase.pulls.map((pull, pullIndex) => (
                                                <Chip
                                                    key={pullIndex}
                                                    label={`${pull.cardName} - $${pull.marketValue}`}
                                                    color={pull.marketValue > purchase.price ? 'success' : 'default'}
                                                    size="small"
                                                    className="pull-chip"
                                                />
                                            ))}
                                        </Box>
                                        {purchase.affiliateLink && (
                                            <Button 
                                                variant="outlined" 
                                                href={purchase.affiliateLink}
                                                target="_blank"
                                                size="small"
                                            >
                                                Buy Similar
                                            </Button>
                                        )}
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            <Button
                variant="contained"
                onClick={() => setShowAddDialog(true)}
                className="add-purchase-button"
                startIcon={<Store />}
            >
                Add Purchase
            </Button>

            {/* Add Purchase Dialog */}
            <Dialog
                open={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                maxWidth="md"
                fullWidth
            >
                {/* Add purchase form */}
            </Dialog>
        </div>
    );
};

export default ShopPurchaseTracker;
