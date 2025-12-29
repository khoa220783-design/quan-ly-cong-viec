/**
 * @file Dashboard.jsx
 * @description Enhanced Dashboard with Charts, Time Range, and Quick Actions
 * Follows 2024 Dashboard Best Practices
 */

import React, { useState } from 'react';
import { FaChartBar, FaTerminal, FaRocket, FaExternalLinkAlt } from 'react-icons/fa';
import { useWalletContext } from '../../wallet/WalletContext';
import { useTaskContext } from '../TaskContext';
import { formatDiaChi } from '../../common/utils/format';
import StatsPanel from './StatsPanel';
import ActivityTerminal from './ActivityTerminal';
import TimeRangeSelector from './TimeRangeSelector';
import QuickActionsFAB from './QuickActionsFAB';
import EmptyDashboard from './EmptyDashboard';
import TaskForm from './TaskForm';
import { EarningsChart, CompletionTrendChart, PriorityDistributionChart } from './DashboardCharts';

const Dashboard = () => {
    const { diaChiVi } = useWalletContext();
    const { danhSachCongViec, capNhatBoLoc } = useTaskContext();

    const [timeRange, setTimeRange] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const hasData = danhSachCongViec.length > 0;

    const handlePriorityClick = (priority) => {
        // Filter tasks by priority
        capNhatBoLoc({ doUuTien: priority });
    };

    const handleViewUrgent = () => {
        // Navigate to urgent tasks (you could implement tab switching here)
        capNhatBoLoc({ trangThai: 'pending' });
    };

    // Empty state for new users
    if (!hasData) {
        return (
            <div className="space-y-8 animate-fade-in">
                <EmptyDashboard onCreateTask={() => setIsFormOpen(true)} />
                <TaskForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    taskToEdit={null}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Welcome & Time Range */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden bg-surface-elevated border border-border rounded-2xl p-6 group shadow-lg flex-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity duration-500">
                        <FaRocket className="w-16 h-16 text-neon-green -rotate-12 transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 mb-3">
                            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                            <span className="font-mono text-[10px] text-neon-green uppercase tracking-widest">Live Dashboard</span>
                        </div>

                        <h1 className="font-display text-2xl font-bold text-primary mb-1">
                            {diaChiVi ? (
                                <>Chào, <span className="text-neon-cyan">{formatDiaChi(diaChiVi)}</span><span className="text-neon-green animate-blink">_</span></>
                            ) : (
                                <>Dashboard<span className="text-neon-green">_</span></>
                            )}
                        </h1>
                        <p className="font-mono text-xs text-secondary">
                            Theo dõi hiệu suất và thu nhập ETH của bạn
                        </p>
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-4">
                    <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                    <a
                        href={diaChiVi ? `https://sepolia.etherscan.io/address/${diaChiVi}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-surface-elevated border border-border text-secondary hover:text-primary hover:border-neon-cyan transition-all"
                        title="View on Etherscan"
                    >
                        <FaExternalLinkAlt className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Stats Panel (Main KPIs) */}
            <StatsPanel />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <EarningsChart />
                </div>
                <PriorityDistributionChart onPriorityClick={handlePriorityClick} />
            </div>

            {/* Secondary Row: Trend + Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Completion Trend */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <FaChartBar className="text-neon-cyan w-4 h-4" />
                        <h2 className="font-display font-semibold text-primary uppercase tracking-wider text-sm">
                            Xu Hướng
                        </h2>
                    </div>
                    <CompletionTrendChart />
                </div>

                {/* Right Column - Terminal Activity */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <FaTerminal className="text-neon-green w-4 h-4" />
                        <h2 className="font-display font-semibold text-primary uppercase tracking-wider text-sm">
                            Hoạt Động Gần Đây
                        </h2>
                    </div>
                    <ActivityTerminal />

                    {/* Quick Info Card */}
                    <div className="p-4 bg-surface-elevated/50 border border-border border-dashed rounded-xl">
                        <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                            Tip: Blockchain Sync
                        </h3>
                        <p className="font-mono text-[11px] text-dim leading-relaxed">
                            Các sự kiện được đồng bộ trực tiếp từ mạng Sepolia.
                            Có thể mất vài giây để giao dịch được xác nhận.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions FAB */}
            <QuickActionsFAB
                onCreateTask={() => setIsFormOpen(true)}
                onViewUrgent={handleViewUrgent}
            />

            {/* Task Form Modal */}
            <TaskForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                taskToEdit={null}
            />
        </div>
    );
};

export default Dashboard;
