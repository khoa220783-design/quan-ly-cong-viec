/**
 * @file EmptyDashboard.jsx
 * @description Empty state component for dashboard when no tasks exist
 */

import React from 'react';
import { FaRocket, FaPlus, FaLightbulb } from 'react-icons/fa';
import Button from '../../common/components/Button';

const EmptyDashboard = ({ onCreateTask }) => {
    return (
        <div className="bg-surface-elevated border border-dashed border-border rounded-2xl p-12 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-green/10 mb-6">
                <FaRocket className="w-10 h-10 text-neon-green animate-bounce" />
            </div>

            <h2 className="font-display text-2xl font-bold text-primary mb-3">
                Chào mừng đến Dashboard!
            </h2>

            <p className="font-mono text-sm text-secondary max-w-md mx-auto mb-6">
                Bạn chưa có công việc nào. Tạo task đầu tiên để bắt đầu theo dõi
                tiến độ, thống kê và thu nhập ETH của bạn.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button
                    onClick={onCreateTask}
                    variant="primary"
                    size="lg"
                    icon={<FaPlus className="w-4 h-4" />}
                >
                    Tạo Task Đầu Tiên
                </Button>
            </div>

            {/* Quick tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 border-t border-border">
                <div className="p-4 rounded-xl bg-surface/50">
                    <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-2 mx-auto">
                        <span className="text-neon-cyan text-lg">1</span>
                    </div>
                    <p className="font-mono text-xs text-muted">Tạo task với tiêu đề và mô tả</p>
                </div>
                <div className="p-4 rounded-xl bg-surface/50">
                    <div className="w-8 h-8 rounded-lg bg-neon-orange/10 flex items-center justify-center mb-2 mx-auto">
                        <span className="text-neon-orange text-lg">2</span>
                    </div>
                    <p className="font-mono text-xs text-muted">Đặt deadline và phần thưởng ETH</p>
                </div>
                <div className="p-4 rounded-xl bg-surface/50">
                    <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center mb-2 mx-auto">
                        <span className="text-neon-green text-lg">3</span>
                    </div>
                    <p className="font-mono text-xs text-muted">Hoàn thành và nhận thưởng!</p>
                </div>
            </div>
        </div>
    );
};

export default EmptyDashboard;
