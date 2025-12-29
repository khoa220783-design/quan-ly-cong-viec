/**
 * @file DashboardCharts.jsx
 * @description Charts for Dashboard - ETH Earnings, Completion Trend, Priority Distribution
 */

import React, { useMemo } from 'react';
import { ethers } from 'ethers';
import {
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useTaskContext } from '../TaskContext';

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-elevated border border-border rounded-lg p-3 shadow-lg">
                <p className="font-mono text-xs text-muted mb-1">{label}</p>
                {payload.map((item, index) => (
                    <p key={index} className="font-display font-bold" style={{ color: item.color }}>
                        {item.name}: {item.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ETH Earnings Over Time (Line Chart)
export const EarningsChart = () => {
    const { danhSachCongViec } = useTaskContext();

    const data = useMemo(() => {
        // Group completed tasks by day (last 7 days)
        const days = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayKey = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' });

            const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime() / 1000;
            const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime() / 1000;

            const tasksCompletedToday = danhSachCongViec.filter(t => {
                const deadline = Number(t.hanChot);
                return t.daHoanThanh && deadline >= dayStart && deadline <= dayEnd;
            });

            const earnings = tasksCompletedToday.reduce((sum, t) => {
                const reward = t.tienThuong && t.tienThuong !== '0'
                    ? parseFloat(ethers.formatEther(t.tienThuong))
                    : 0;
                return sum + reward;
            }, 0);

            days.push({
                name: dayKey,
                earnings: parseFloat(earnings.toFixed(4)),
                tasks: tasksCompletedToday.length
            });
        }

        return days;
    }, [danhSachCongViec]);

    return (
        <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <h4 className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
                ETH Thu Nhập (7 Ngày)
            </h4>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="name"
                        stroke="var(--text-muted)"
                        tick={{ fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        tick={{ fontSize: 10, fontFamily: 'monospace' }}
                        tickFormatter={(v) => `${v} ETH`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="earnings"
                        name="ETH"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ fill: '#f97316', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#f97316' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Completion Trend (Area Chart)
export const CompletionTrendChart = () => {
    const { danhSachCongViec } = useTaskContext();

    const data = useMemo(() => {
        const days = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayKey = date.toLocaleDateString('vi-VN', { weekday: 'short' });

            const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime() / 1000;

            const totalByDay = danhSachCongViec.filter(t => Number(t.hanChot) <= dayEnd).length;
            const completedByDay = danhSachCongViec.filter(t =>
                t.daHoanThanh && Number(t.hanChot) <= dayEnd
            ).length;

            const rate = totalByDay > 0 ? Math.round((completedByDay / totalByDay) * 100) : 0;

            days.push({
                name: dayKey,
                completed: completedByDay,
                total: totalByDay,
                rate
            });
        }

        return days;
    }, [danhSachCongViec]);

    return (
        <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <h4 className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
                Xu Hướng Hoàn Thành (7 Ngày)
            </h4>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="name"
                        stroke="var(--text-muted)"
                        tick={{ fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        tick={{ fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="completed"
                        name="Hoàn thành"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCompleted)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// Priority Distribution (Donut Chart)
export const PriorityDistributionChart = ({ onPriorityClick }) => {
    const { danhSachCongViec } = useTaskContext();

    const data = useMemo(() => {
        const high = danhSachCongViec.filter(t => t.doUuTien === 2 && !t.daHoanThanh).length;
        const medium = danhSachCongViec.filter(t => t.doUuTien === 1 && !t.daHoanThanh).length;
        const low = danhSachCongViec.filter(t => t.doUuTien === 0 && !t.daHoanThanh).length;
        const completed = danhSachCongViec.filter(t => t.daHoanThanh).length;

        return [
            { name: 'Cao', value: high, color: '#ef4444', priority: 2 },
            { name: 'Trung bình', value: medium, color: '#f97316', priority: 1 },
            { name: 'Thấp', value: low, color: '#22c55e', priority: 0 },
            { name: 'Hoàn thành', value: completed, color: '#06b6d4', priority: -1 }
        ].filter(item => item.value > 0);
    }, [danhSachCongViec]);

    const handleClick = (data) => {
        if (onPriorityClick && data.priority >= 0) {
            onPriorityClick(data.priority);
        }
    };

    return (
        <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <h4 className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
                Phân Bổ Độ Ưu Tiên
            </h4>
            {data.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-muted font-mono text-sm">
                    Chưa có dữ liệu
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            onClick={handleClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            formatter={(value) => <span className="text-secondary text-xs font-mono">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default { EarningsChart, CompletionTrendChart, PriorityDistributionChart };
