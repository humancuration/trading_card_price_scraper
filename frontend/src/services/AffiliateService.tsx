import React from 'react';

interface AffiliatePartner {
    id: string;
    name: string;
    baseUrl: string;
    affiliateId: string;
    commission: number;
    trackingParam: string;
    regions: string[];
    productTypes: string[];
}

interface AffiliateLink {
    partnerId: string;
    productId: string;
    url: string;
    createdAt: Date;
    clickCount: number;
    conversions: number;
}

// Example affiliate partner configurations
const affiliatePartners: AffiliatePartner[] = [
    {
        id: 'tcgplayer',
        name: 'TCGPlayer',
        baseUrl: 'https://www.tcgplayer.com',
        affiliateId: 'YOUR_TCGPLAYER_ID',
        commission: 0.05, // 5%
        trackingParam: 'partner',
        regions: ['US', 'CA'],
        productTypes: ['singles', 'sealed', 'supplies']
    },
    {
        id: 'cardmarket',
        name: 'Cardmarket',
        baseUrl: 'https://www.cardmarket.com',
        affiliateId: 'YOUR_CARDMARKET_ID',
        commission: 0.04, // 4%
        trackingParam: 'utm_source',
        regions: ['EU', 'UK'],
        productTypes: ['singles', 'sealed']
    }
];

class AffiliateService {
    private static instance: AffiliateService;
    private partners: Map<string, AffiliatePartner>;
    private links: Map<string, AffiliateLink>;

    private constructor() {
        this.partners = new Map(affiliatePartners.map(p => [p.id, p]));
        this.links = new Map();
    }

    static getInstance(): AffiliateService {
        if (!AffiliateService.instance) {
            AffiliateService.instance = new AffiliateService();
        }
        return AffiliateService.instance;
    }

    generateAffiliateLink(partnerId: string, productInfo: {
        id: string;
        name: string;
        type: string;
        price?: number;
    }): string {
        const partner = this.partners.get(partnerId);
        if (!partner) throw new Error('Invalid partner ID');

        // Create tracking URL
        const baseUrl = `${partner.baseUrl}/product/${productInfo.id}`;
        const trackingUrl = new URL(baseUrl);
        trackingUrl.searchParams.append(partner.trackingParam, partner.affiliateId);
        trackingUrl.searchParams.append('ref', 'your_site_name');
        
        // Add product-specific parameters
        trackingUrl.searchParams.append('product_name', encodeURIComponent(productInfo.name));
        if (productInfo.price) {
            trackingUrl.searchParams.append('price', productInfo.price.toString());
        }

        // Store link for tracking
        const link: AffiliateLink = {
            partnerId,
            productId: productInfo.id,
            url: trackingUrl.toString(),
            createdAt: new Date(),
            clickCount: 0,
            conversions: 0
        };
        this.links.set(`${partnerId}-${productInfo.id}`, link);

        return trackingUrl.toString();
    }

    async trackClick(partnerId: string, productId: string): Promise<void> {
        const linkKey = `${partnerId}-${productId}`;
        const link = this.links.get(linkKey);
        if (link) {
            link.clickCount++;
            await this.saveAnalytics({
                type: 'click',
                partnerId,
                productId,
                timestamp: new Date(),
            });
        }
    }

    async trackConversion(partnerId: string, productId: string, value: number): Promise<void> {
        const linkKey = `${partnerId}-${productId}`;
        const link = this.links.get(linkKey);
        if (link) {
            link.conversions++;
            await this.saveAnalytics({
                type: 'conversion',
                partnerId,
                productId,
                value,
                timestamp: new Date(),
            });
        }
    }

    private async saveAnalytics(data: any): Promise<void> {
        try {
            await fetch('/api/affiliate/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to save affiliate analytics:', error);
        }
    }

    // React Hook for easy affiliate link generation and tracking
    useAffiliateLink(partnerId: string, productInfo: {
        id: string;
        name: string;
        type: string;
        price?: number;
    }) {
        const link = React.useMemo(() => 
            this.generateAffiliateLink(partnerId, productInfo),
            [partnerId, productInfo]
        );

        const handleClick = React.useCallback(() => {
            this.trackClick(partnerId, productInfo.id);
        }, [partnerId, productInfo.id]);

        return {
            link,
            handleClick,
            trackConversion: (value: number) => 
                this.trackConversion(partnerId, productInfo.id, value)
        };
    }

    // Get best affiliate link based on user's region and product type
    getBestAffiliate(productType: string, userRegion: string): AffiliatePartner | null {
        return Array.from(this.partners.values())
            .find(partner => 
                partner.productTypes.includes(productType) &&
                partner.regions.includes(userRegion)
            ) || null;
    }

    // Get commission rates for different partners
    getCommissionRates(): Map<string, number> {
        return new Map(
            Array.from(this.partners.values())
                .map(partner => [partner.id, partner.commission])
        );
    }
}

export default AffiliateService;
