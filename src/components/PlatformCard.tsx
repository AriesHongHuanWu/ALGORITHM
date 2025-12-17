
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Music, Hash, Zap, BarChart3 } from 'lucide-react';
import type { Trend, PlatformMetrics, Prediction } from '../algorithm/SocialPredictor';

interface PlatformCardProps {
    platformName: string;
    icon: React.ReactNode;
    metrics: PlatformMetrics;
    trends: Trend[];
    bestTimes: Prediction[];
    color: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platformName, icon, metrics, trends, bestTimes, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-32 blur-[60px] opacity-20 bg-[${color}] rounded-full -mr-16 -mt-16 transition-opacity duration-500 group-hover:opacity-30`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${color === '#1DB954' ? 'text-green-400' : color === '#E1306C' ? 'text-pink-500' : 'text-cyan-400'}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold capitalize">{platformName}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Tracking
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold font-mono">{metrics.currentActiveUsers.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Active Users</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="glass p-4 rounded-xl border-l-2 border-l-blue-500">
                    <div className="text-gray-400 text-xs mb-1">Engagement Rate</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                        {metrics.engagementRate}%
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                    </div>
                </div>
                <div className="glass p-4 rounded-xl border-l-2 border-l-purple-500">
                    <div className="text-gray-400 text-xs mb-1">Upload Traffic</div>
                    <div className="text-2xl font-bold capitalize flex items-center gap-2">
                        {metrics.uploadTraffic}
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                </div>
            </div>

            <div className="mb-6 relative z-10">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" /> Best Time to Upload (Today)
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {bestTimes.map((pred, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-2 text-center border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                            <div className="text-lg font-bold text-white">{pred.time}</div>
                            <div className="text-[10px] text-green-400 font-mono">Score: {pred.score}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <TrendingIcon platform={platformName} /> Top Trends
                </h4>
                <div className="space-y-2">
                    {trends.slice(0, 3).map((trend, i) => (
                        <div key={trend.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 font-mono text-xs">0{i + 1}</span>
                                <span className="font-medium text-gray-200">{trend.name}</span>
                            </div>
                            <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">{trend.volume}</div>
                        </div>
                    ))}
                </div>
            </div>

        </motion.div>
    );
};

const TrendingIcon = ({ platform }: { platform: string }) => {
    if (platform === 'spotify') return <Music className="w-4 h-4 text-green-400" />;
    return <Hash className="w-4 h-4 text-blue-400" />;
}

export default PlatformCard;
