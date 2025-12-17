import { addHours, format, startOfHour } from 'date-fns';

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
        { id: '1', name: 'Golden Hour Aesthetic', category: 'theme', growth: 125, volume: '2.4M' },
        { id: '2', name: '#DailyVlog', category: 'hashtag', growth: 85, volume: '15M' },
        { id: '3', name: 'Lo-Fi Chill', category: 'music', growth: 45, volume: '850K' },
        { id: '4', name: 'Reel Transitions', category: 'theme', growth: 200, volume: '5M' },
    ],
    tiktok: [
        { id: '1', name: 'Speed Up Songs', category: 'music', growth: 350, volume: '12M' },
        { id: '2', name: '#CoreCore', category: 'hashtag', growth: 180, volume: '80M' },
        { id: '3', name: 'Dance Challenge 2024', category: 'theme', growth: 500, volume: '3.2M' },
        { id: '4', name: 'POV', category: 'theme', growth: 90, volume: '100M+' },
    ],
    spotify: [
        { id: '1', name: 'Phonk Brazil', category: 'music', growth: 110, volume: '400K Listeners' },
        { id: '2', name: 'Sad Boi Hours', category: 'theme', growth: 60, volume: '1.2M Saves' },
        { id: '3', name: 'Gym Motivation', category: 'theme', growth: 95, volume: '5M Streams' },
        { id: '4', name: 'Indie Pop', category: 'music', growth: 30, volume: '900K Listeners' },
    ]
};

export class SocialPredictor {

    static getBestTimes(platform: Platform): Prediction[] {
        const now = new Date();
        const predictions: Prediction[] = [];

        // Simulate prediction based on platform specific "peak" hours (simplified)
        const peakHours = {
            instagram: [9, 11, 19, 20], // 9AM, 11AM, 7PM, 8PM
            tiktok: [10, 14, 21, 23],   // 10AM, 2PM, 9PM, 11PM
            spotify: [8, 17, 22]        // 8AM, 5PM, 10PM
        };

        for (let i = 1; i <= 24; i++) {
            const timeSlot = addHours(startOfHour(now), i);
            const hour = timeSlot.getHours();
            let score = Math.floor(Math.random() * 40) + 30; // Base score 30-70

            if (peakHours[platform].includes(hour)) {
                score += Math.floor(Math.random() * 20) + 20; // Boost for peak hours
            }

            if (score > 100) score = 100;

            predictions.push({
                time: format(timeSlot, 'HH:mm'),
                score,
                reason: score > 80 ? 'High active user base expected' : 'Moderate engagement window'
            });
        }

        // Sort by score descending and take top 3
        return predictions.sort((a, b) => b.score - a.score).slice(0, 3);
    }

    static getTrends(platform: Platform): Trend[] {
        // Randomize order slightly to simulate dynamic updates
        return [...MOCK_TRENDS[platform]].sort(() => Math.random() - 0.5);
    }

    static getLiveMetrics(platform: Platform): PlatformMetrics {
        // Simulate live fluctuation
        const baseUsers = {
            instagram: 5000000,
            tiktok: 8000000,
            spotify: 3000000
        };

        const fluctuation = Math.random() * 0.1 - 0.05; // +/- 5%
        const currentActiveUsers = Math.floor(baseUsers[platform] * (1 + fluctuation));
        const engagementRate = parseFloat((Math.random() * 5 + 2).toFixed(2));

        return {
            currentActiveUsers,
            engagementRate, // 2-7%
            uploadTraffic: currentActiveUsers > baseUsers[platform] ? 'peak' : 'moderate',
            retentionRate: parseFloat((Math.random() * 30 + 40).toFixed(1)), // 40-70%
            shareRatio: parseFloat((Math.random() * 2 + 0.5).toFixed(1)), // 0.5 - 2.5
            viralPotential: Math.floor(engagementRate * 10 + Math.random() * 20)
        };
    }

    static getActivityHistory(_platform: Platform): ActivityPoint[] {
        const points: ActivityPoint[] = [];
        const now = new Date();
        // Generate data for last 12 hours
        for (let i = 12; i >= 0; i--) {
            const time = addHours(now, -i);
            points.push({
                time: format(time, 'HH:mm'),
                value: Math.floor(Math.random() * 1000) + 500 + (Math.random() > 0.8 ? 1000 : 0) // Random spikes
            });
        }
        return points;
    }
}
