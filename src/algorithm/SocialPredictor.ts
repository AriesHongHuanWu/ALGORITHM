import { addHours, format } from 'date-fns';

export type Platform = 'instagram' | 'tiktok' | 'spotify';

export interface Trend {
    id: string;
    name: string;
    category: 'music' | 'theme' | 'hashtag';
    growth: number; // Percentage growth
    volume: string;
}

export interface Prediction {
    time: string;
    score: number; // 0-100
    reason: string;
}

export interface PlatformMetrics {
    currentActiveUsers: number;
    engagementRate: number;
    uploadTraffic: 'low' | 'moderate' | 'high' | 'peak';
    retentionRate: number; // New metric
    shareRatio: number;    // New metric
    viralPotential: number; // 0-100 gauge
}

export interface Demographics {
    ageGroup: { label: string; percentage: number }[];
    locations: { label: string; percentage: number }[];
}

export interface ActivityPoint {
    time: string;
    value: number;
}

const MOCK_TRENDS: Record<Platform, Trend[]> = {
    instagram: [
        { id: '1', name: 'Nostalgia Core (Vintage)', category: 'theme', growth: 145, volume: 'High' },
        { id: '2', name: '#NoEditEdit (Authentic)', category: 'hashtag', growth: 88, volume: 'Trending' },
        { id: '3', name: 'Maximalism Visuals', category: 'theme', growth: 62, volume: 'Rising' },
        { id: '4', name: 'Day-in-the-Life Reels', category: 'theme', growth: 210, volume: 'Viral' },
    ],
    tiktok: [
        { id: '1', name: 'All I Want For Christmas', category: 'music', growth: 500, volume: 'Peaking' },
        { id: '2', name: '#2025Resolutions', category: 'hashtag', growth: 320, volume: 'Exploding' },
        { id: '3', name: 'Shake It to the Max', category: 'music', growth: 235, volume: 'Viral' },
        { id: '4', name: '#DecemberVibes', category: 'hashtag', growth: 150, volume: '12.4B views' },
    ],
    spotify: [
        { id: '1', name: 'Die With A Smile', category: 'music', growth: 180, volume: '#1 Global' },
        { id: '2', name: 'BIRDS OF A FEATHER', category: 'music', growth: 95, volume: 'Top 10' },
        { id: '3', name: 'Espresso (Sabrina)', category: 'music', growth: 120, volume: 'Viral' },
        { id: '4', name: 'Good Luck, Babe!', category: 'music', growth: 85, volume: 'Trending' },
    ]
};

export class SocialPredictor {

    // Store previous state to simulate smooth drift
    private static state: Record<Platform, PlatformMetrics> = {
        instagram: SocialPredictor.generateInitialMetrics(5000000),
        tiktok: SocialPredictor.generateInitialMetrics(8000000),
        spotify: SocialPredictor.generateInitialMetrics(3000000)
    };

    private static generateInitialMetrics(baseUsers: number): PlatformMetrics {
        return {
            currentActiveUsers: baseUsers,
            engagementRate: 4.5,
            uploadTraffic: 'moderate',
            retentionRate: 55.0,
            shareRatio: 1.2,
            viralPotential: 50
        };
    }

    static getBestTimes(platform: Platform): Prediction[] {
        const now = new Date();
        const predictions: Prediction[] = [];

        const peakWindows = {
            instagram: [{ h: 12, m: 15 }, { h: 19, m: 30 }, { h: 21, m: 0 }],
            tiktok: [{ h: 10, m: 45 }, { h: 15, m: 20 }, { h: 22, m: 15 }],
            spotify: [{ h: 8, m: 30 }, { h: 17, m: 45 }, { h: 23, m: 0 }]
        };

        const platformWindows = peakWindows[platform];

        platformWindows.forEach(window => {
            const timeSlot = new Date(now);
            timeSlot.setHours(window.h, window.m + Math.floor(Math.random() * 10), 0);

            if (timeSlot < now) {
                timeSlot.setDate(timeSlot.getDate() + 1);
            }

            // Score based on proximity to "perfect" viral window
            const baseScore = 88;
            const variance = Math.random() * 10;
            const score = Math.floor(baseScore + variance);

            predictions.push({
                time: format(timeSlot, 'HH:mm'),
                score,
                reason: score > 94 ? 'Peak audience overlap detected' : 'Optimal engagement window'
            });
        });

        return predictions.sort((a, b) => a.time.localeCompare(b.time));
    }

    static getTrends(platform: Platform): Trend[] {
        // Randomize order and slightly fluctuate growth numbers to simulate live tracking
        return MOCK_TRENDS[platform].map(trend => ({
            ...trend,
            growth: trend.growth + Math.floor(Math.random() * 10 - 5) // Fluctuate +/- 5%
        })).sort(() => Math.random() - 0.5);
    }

    static getLiveMetrics(platform: Platform): PlatformMetrics {
        const currentState = this.state[platform];

        // Draco drift algorithm (Smooth random walk)
        const drift = (value: number, factor: number) => value + (Math.random() * factor * 2 - factor);

        // 1. Active Users Drift (Slow change)
        const baseUsers = platform === 'instagram' ? 5000000 : platform === 'tiktok' ? 8000000 : 3000000;
        let newUsers = Math.floor(drift(currentState.currentActiveUsers, baseUsers * 0.005)); // 0.5% drift
        // Clamp to realistic range
        if (newUsers < baseUsers * 0.8) newUsers = Math.floor(baseUsers * 0.8);
        if (newUsers > baseUsers * 1.5) newUsers = Math.floor(baseUsers * 1.5);

        // 2. Engagement Rate (Correlated with users slightly)
        let newEngagement = parseFloat(drift(currentState.engagementRate, 0.2).toFixed(2));
        if (newEngagement < 1.5) newEngagement = 1.5;
        if (newEngagement > 9.5) newEngagement = 9.5;

        // 3. Derived Metrics
        const trafficState = newUsers > baseUsers * 1.2 ? 'peak' : newUsers > baseUsers * 1.05 ? 'high' : newUsers > baseUsers * 0.9 ? 'moderate' : 'low';

        // Retention & Share Ratio drift
        let newRetention = parseFloat(drift(currentState.retentionRate, 0.8).toFixed(1));
        if (newRetention > 95) newRetention = 95;
        if (newRetention < 20) newRetention = 20;

        let newShare = parseFloat(drift(currentState.shareRatio, 0.1).toFixed(1));
        if (newShare < 0.1) newShare = 0.1;
        if (newShare > 5.0) newShare = 5.0;

        // Viral Potential Calculation (Weighted average of other metrics)
        const viralScore = Math.min(100, Math.floor(
            (newEngagement * 5) + (newShare * 10) + (newRetention * 0.4)
        ));

        // Update State
        const newState: PlatformMetrics = {
            currentActiveUsers: newUsers,
            engagementRate: newEngagement,
            uploadTraffic: trafficState as any,
            retentionRate: newRetention,
            shareRatio: newShare,
            viralPotential: viralScore
        };

        this.state[platform] = newState;
        return newState;
    }

    static getActivityHistory(_platform: Platform): ActivityPoint[] {
        const points: ActivityPoint[] = [];
        const now = new Date();
        let value = 5000; // Starting baseline

        for (let i = 12; i >= 0; i--) {
            const time = addHours(now, -i);
            // Smooth curve generation
            value = value + (Math.random() * 2000 - 1000);
            if (value < 1000) value = 1000;

            points.push({
                time: format(time, 'HH:mm'),
                value: Math.floor(value)
            });
        }
        return points;
    }
}
