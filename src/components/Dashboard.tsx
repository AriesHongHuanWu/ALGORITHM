
import React, { useEffect, useState } from 'react';
import { SocialPredictor } from '../algorithm/SocialPredictor';
import type { Platform, PlatformMetrics, Trend, Prediction } from '../algorithm/SocialPredictor';
import { Instagram, Music2, Share2, Activity, Clock, RefreshCw } from 'lucide-react';
import PlatformCard from './PlatformCard';

const Dashboard: React.FC = () => {
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [metrics, setMetrics] = useState<Record<Platform, PlatformMetrics>>({
        instagram: SocialPredictor.getLiveMetrics('instagram'),
        tiktok: SocialPredictor.getLiveMetrics('tiktok'),
        spotify: SocialPredictor.getLiveMetrics('spotify')
    });

    // We can memorize trends/best times as they don't change as frantically as live metrics
    // But for "simulation" effect we can refresh them occasionally.
    const [trends, setTrends] = useState<Record<Platform, Trend[]>>({
        instagram: SocialPredictor.getTrends('instagram'),
        tiktok: SocialPredictor.getTrends('tiktok'),
        spotify: SocialPredictor.getTrends('spotify')
    });

    const [bestTimes, setBestTimes] = useState<Record<Platform, Prediction[]>>({
        instagram: SocialPredictor.getBestTimes('instagram'),
        tiktok: SocialPredictor.getBestTimes('tiktok'),
        spotify: SocialPredictor.getBestTimes('spotify')
    });

    useEffect(() => {
        // Live fluctuation effect
        const interval = setInterval(() => {
            setMetrics({
                instagram: SocialPredictor.getLiveMetrics('instagram'),
                tiktok: SocialPredictor.getLiveMetrics('tiktok'),
                spotify: SocialPredictor.getLiveMetrics('spotify')
            });
            setLastUpdated(new Date());
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleManualRefresh = () => {
        setTrends({
            instagram: SocialPredictor.getTrends('instagram'),
            tiktok: SocialPredictor.getTrends('tiktok'),
            spotify: SocialPredictor.getTrends('spotify')
        });
        setBestTimes({
            instagram: SocialPredictor.getBestTimes('instagram'),
            tiktok: SocialPredictor.getBestTimes('tiktok'),
            spotify: SocialPredictor.getBestTimes('spotify')
        });
        setLastUpdated(new Date());
    }

    return (
        <div className="min-h-screen bg-[#050511] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-900/20">
                                <Activity className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Social Pulse AI
                            </h1>
                        </div>
                        <p className="text-gray-400 max-w-lg">
                            Real-time algorithmic predictions for optimal engagement across social networks.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <div className="text-xs text-gray-500 font-mono">System Status</div>
                            <div className="text-green-400 text-sm font-semibold flex items-center justify-end gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Online
                            </div>
                        </div>
                        <button
                            onClick={handleManualRefresh}
                            className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">Refresh Analysis</span>
                        </button>
                    </div>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PlatformCard
                        platformName="Instagram"
                        icon={<Instagram className="w-6 h-6" />}
                        metrics={metrics.instagram}
                        trends={trends.instagram}
                        bestTimes={bestTimes.instagram}
                        color="#E1306C"
                    />
                    <PlatformCard
                        platformName="TikTok"
                        icon={<Share2 className="w-6 h-6" />} // Using Share2 as proxy for TikTok icon if needed or specific SVG
                        metrics={metrics.tiktok}
                        trends={trends.tiktok}
                        bestTimes={bestTimes.tiktok}
                        color="#00f2ea"
                    />
                    <PlatformCard
                        platformName="Spotify"
                        icon={<Music2 className="w-6 h-6" />}
                        metrics={metrics.spotify}
                        trends={trends.spotify}
                        bestTimes={bestTimes.spotify}
                        color="#1DB954"
                    />
                </div>

                {/* Footer / Status Bar */}
                <div className="mt-12 border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-6">
                        <span>Algorithm v2.1.0</span>
                        <span>Latency: 24ms</span>
                        <span>Region: Asia-Pacific</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Clock className="w-3 h-3" />
                        Last Update: {lastUpdated.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
