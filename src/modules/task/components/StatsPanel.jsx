/**
 * @file StatsPanel.jsx
 * @description Enhanced Statistics Dashboard với terminal aesthetic
 * Author: My - Commit My 2
 */

import React, { useMemo } from 'react';
import { ethers } from 'ethers';
import {
    FaTerminal,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCoins,
    FaClock,
    FaTasks,
    FaChartLine,
    FaFire
} from 'react-icons/fa';
import { useTaskContext } from '../TaskContext';

const StatsPanel = () => {
    const { danhSachCongViec } = useTaskContext();

    // Calculate comprehensive stats
    const stats = useMemo(() => {
        const total = danhSachCongViec.length;
        const completed = danhSachCongViec.filter(t => t.daHoanThanh).length;
        const now = Math.floor(Date.now() / 1000);
        const overdue = danhSachCongViec.filter(t => !t.daHoanThanh && Number(t.hanChot) < now).length;
        const urgent = danhSachCongViec.filter(t => {
            const diff = Number(t.hanChot) - now;
            return !t.daHoanThanh && diff > 0 && diff < 86400;
        }).length;

        // Calculate rewards
        const totalReward = danhSachCongViec.reduce((sum, t) => {
            const reward = t.tienThuong && t.tienThuong !== '0'
                ? parseFloat(ethers.formatEther(t.tienThuong))
                : 0;
            return sum + reward;
        }, 0);

        const earnedReward = danhSachCongViec.filter(t => t.daHoanThanh).reduce((sum, t) => {
            const reward = t.tienThuong && t.tienThuong !== '0'
                ? parseFloat(ethers.formatEther(t.tienThuong))
                : 0;
            return sum + reward;
        }, 0);

        // Completion rate
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Priority breakdown
        const highPriority = danhSachCongViec.filter(t => t.doUuTien === 2 && !t.daHoanThanh).length;

        return {
            total,
            completed,
            overdue,
            urgent,
            totalReward,
            earnedReward,
            completionRate,
            highPriority,
            pending: total - completed
        };
    }, [danhSachCongViec]);

    // Stat Card Component
    const StatCard = ({ icon: Icon, label, value, color, sub, trend }) => (
        <div className="bg-surface-elevated border border-border rounded-xl p-4 hover:border-border-default transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-mono text-2xs text-muted uppercase tracking-widest mb-1">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
                        {trend && (
                            <span className={`text-xs font-mono ${trend > 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </span>
                        )}
                    </div>
                    {sub && <p className="font-mono text-xs text-dim mt-0.5">{sub}</p>}
                </div>
                <div className={`p-2.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${color === 'text-neon-green' ? 'bg-neon-green/10' :
                        color === 'text-neon-red' ? 'bg-neon-red/10' :
                            color === 'text-neon-orange' ? 'bg-neon-orange/10' :
                                'bg-neon-cyan/10'
                    }`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
            </div>
        </div>
    );

    // Progress Bar Component
    const ProgressBar = ({ value, max, label, color = 'bg-neon-green' }) => (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
                <span className="text-muted">{label}</span>
                <span className="text-secondary">{value}/{max}</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-500 rounded-full`}
                    style={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-neon-green text-sm">$</span>
                <span className="font-mono text-secondary text-sm">taskmgr</span>
                <span className="font-mono text-dim text-sm">--stats</span>
                <FaChartLine className="w-4 h-4 text-neon-cyan ml-2" />
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={FaTerminal}
                    label="Tổng Số"
                    value={stats.total}
                    color="text-neon-cyan"
                />
                <StatCard
                    icon={FaCheckCircle}
                    label="Hoàn Thành"
                    value={stats.completed}
                    color="text-neon-green"
                    sub={stats.total > 0 ? `${stats.completionRate}%` : null}
                />
                <StatCard
                    icon={FaExclamationTriangle}
                    label="Quá Hạn"
                    value={stats.overdue}
                    color={stats.overdue > 0 ? "text-neon-red" : "text-dim"}
                />
                <StatCard
                    icon={FaCoins}
                    label="Phần Thưởng"
                    value={stats.totalReward.toFixed(3)}
                    color="text-neon-orange"
                    sub="ETH"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Completion Progress */}
                <div className="bg-surface-elevated border border-border rounded-xl p-4 lg:col-span-2">
                    <h4 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Tiến Độ Công Việc</h4>
                    <div className="space-y-3">
                        <ProgressBar
                            value={stats.completed}
                            max={stats.total}
                            label="Hoàn thành"
                            color="bg-neon-green"
                        />
                        <ProgressBar
                            value={stats.urgent}
                            max={stats.pending}
                            label="Gấp (< 24h)"
                            color="bg-neon-orange"
                        />
                        <ProgressBar
                            value={stats.highPriority}
                            max={stats.pending}
                            label="Ưu tiên cao"
                            color="bg-neon-red"
                        />
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-surface-elevated border border-border rounded-xl p-4">
                    <h4 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Tổng Quan</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-secondary flex items-center gap-2">
                                <FaClock className="w-3 h-3 text-neon-orange" /> Đang chờ
                            </span>
                            <span className="font-display font-bold text-primary">{stats.pending}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-secondary flex items-center gap-2">
                                <FaFire className="w-3 h-3 text-neon-red" /> Khẩn cấp
                            </span>
                            <span className="font-display font-bold text-neon-red">{stats.urgent}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-secondary flex items-center gap-2">
                                <FaCoins className="w-3 h-3 text-neon-green" /> Đã nhận
                            </span>
                            <span className="font-display font-bold text-neon-green">{stats.earnedReward.toFixed(3)} ETH</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
