
import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailedChartProps {
    data: { time: string; value: number }[];
    color: string;
}

const DetailedChart: React.FC<DetailedChartProps> = ({ data, color }) => {
    return (
        <div className="h-[120px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        hide
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: color }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        fillOpacity={1}
                        fill={`url(#gradient-${color})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DetailedChart;
