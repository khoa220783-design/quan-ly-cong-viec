/**
 * @file LandingPage.jsx
 * @description Landing Page with Connect Wallet CTA
 * Author: My - Commit My 3
 */

import React from 'react';
import { FaWallet, FaEthereum, FaLock, FaRocket, FaTasks, FaUsers } from 'react-icons/fa';
import { useWalletContext } from '../../wallet/WalletContext';
import Button from '../../common/components/Button';

const LandingPage = () => {
    const { ketNoiVi, dangKetNoi } = useWalletContext();

    const features = [
        {
            icon: FaTasks,
            title: 'Quản Lý Công Việc',
            description: 'Tạo, theo dõi và hoàn thành công việc trên blockchain'
        },
        {
            icon: FaEthereum,
            title: 'Phần Thưởng ETH',
            description: 'Nhận thưởng ETH khi hoàn thành công việc'
        },
        {
            icon: FaUsers,
            title: 'Gán Công Việc',
            description: 'Phân công công việc cho thành viên trong team'
        },
        {
            icon: FaLock,
            title: 'Bảo Mật Blockchain',
            description: 'Dữ liệu được lưu trữ an toàn trên Ethereum'
        }
    ];

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                {/* Terminal Header */}
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-surface-elevated border border-border rounded-full">
                    <span className="font-mono text-neon-green text-sm">$</span>
                    <span className="font-mono text-secondary text-sm">taskmgr</span>
                    <span className="font-mono text-dim text-sm">--welcome</span>
                    <span className="w-2 h-4 bg-neon-green animate-blink"></span>
                </div>

                {/* Main Title */}
                <h1 className="font-display text-4xl md:text-6xl font-bold text-primary mb-4">
                    Task Manager<span className="text-neon-green">_</span>
                </h1>
                <p className="font-mono text-lg md:text-xl text-secondary mb-2">
                    Quản lý công việc đơn giản trên Blockchain
                </p>
                <p className="font-mono text-sm text-muted mb-8">
                    Kết nối ví MetaMask để bắt đầu quản lý công việc của bạn
                </p>

                {/* Connect Button */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        onClick={ketNoiVi}
                        disabled={dangKetNoi}
                        variant="primary"
                        size="lg"
                        className="px-8 py-4 text-lg shadow-lg shadow-neon-green/20 hover:shadow-neon-green/40 transition-all"
                        icon={<FaWallet className="w-5 h-5" />}
                    >
                        {dangKetNoi ? 'Đang kết nối...' : 'Kết Nối MetaMask'}
                    </Button>

                    <p className="font-mono text-xs text-dim">
                        Yêu cầu: MetaMask + Sepolia Testnet
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full mb-12">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group bg-surface-elevated border border-border rounded-xl p-5 hover:border-neon-green/30 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/5"
                    >
                        <div className="p-3 bg-neon-cyan/10 rounded-lg w-fit mb-3 group-hover:bg-neon-green/10 transition-colors">
                            <feature.icon className="w-5 h-5 text-neon-cyan group-hover:text-neon-green transition-colors" />
                        </div>
                        <h3 className="font-display font-semibold text-primary mb-1">
                            {feature.title}
                        </h3>
                        <p className="font-mono text-xs text-muted">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Start Guide */}
            <div className="bg-surface-elevated border border-border rounded-xl p-6 max-w-2xl w-full">
                <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FaRocket className="text-neon-orange" /> Quick Start
                </h3>
                <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-start gap-3">
                        <span className="text-neon-green">1.</span>
                        <span className="text-secondary">Cài đặt <span className="text-neon-cyan">MetaMask</span> extension</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-neon-green">2.</span>
                        <span className="text-secondary">Chuyển sang mạng <span className="text-neon-orange">Sepolia Testnet</span></span>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-neon-green">3.</span>
                        <span className="text-secondary">Nhận ETH test từ <span className="text-neon-cyan">Sepolia Faucet</span></span>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-neon-green">4.</span>
                        <span className="text-secondary">Click <span className="text-neon-green">"Kết Nối MetaMask"</span> để bắt đầu</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
