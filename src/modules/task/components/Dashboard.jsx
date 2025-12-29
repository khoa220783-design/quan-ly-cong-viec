/**
 * @file Dashboard.jsx
 * @description Main Dashboard view combining stats and activity logs
 * Author: My - Commit My 6 (Extra)
 */

import React from 'react';
import StatsPanel from './StatsPanel';
import ActivityTerminal from './ActivityTerminal';
import { FaChartBar, FaTerminal, FaRocket } from 'react-icons/fa';
import { useWalletContext } from '../../wallet/WalletContext';
import { formatDiaChi } from '../../common/utils/format';

const Dashboard = () => {
    const { diaChiVi } = useWalletContext();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-surface-elevated border border-border rounded-2xl p-8 group shadow-neon-green/5">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 transition-opacity duration-500">
                    <FaRocket className="w-24 h-24 text-neon-green -rotate-12 transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 mb-4">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                        <span className="font-mono text-[10px] text-neon-green uppercase tracking-widest">Live Dashboard V2.0</span>
                    </div>

                    <h1 className="font-display text-3xl font-bold text-primary mb-2">
                        {diaChiVi ? (
                            <>Chào mừng, <span className="text-neon-cyan">{formatDiaChi(diaChiVi)}</span><span className="text-neon-green animate-blink">_</span></>
                        ) : (
                            <>Chào mừng trở lại, Explorer<span className="text-neon-green">_</span></>
                        )}
                    </h1>
                    <p className="font-mono text-sm text-secondary max-w-xl">
                        Đây là trung tâm điều khiển của bạn. Theo dõi thống kê hiệu suất, thu nhập ETH
                        và lịch sử giao dịch trực tiếp trên Blockchain.
                    </p>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Stats */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <FaChartBar className="text-neon-cyan w-4 h-4" />
                        <h2 className="font-display font-semibold text-primary uppercase tracking-wider text-sm">Hiệu Suất Tổng Quan</h2>
                    </div>
                    <StatsPanel />
                </div>

                {/* Right Column - Terminal Activity */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <FaTerminal className="text-neon-green w-4 h-4" />
                        <h2 className="font-display font-semibold text-primary uppercase tracking-wider text-sm">Hoạt Động Gần Đây</h2>
                    </div>
                    <ActivityTerminal />

                    {/* Quick Info Card */}
                    <div className="p-4 bg-surface-elevated/50 border border-border border-dashed rounded-xl">
                        <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Tip: Blockchain Sync</h3>
                        <p className="font-mono text-[11px] text-dim leading-relaxed">
                            Các sự kiện được đồng bộ trực tiếp từ mạng Sepolia. Có thể mất vài giây để giao dịch được xác nhận và hiển thị trong log.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
