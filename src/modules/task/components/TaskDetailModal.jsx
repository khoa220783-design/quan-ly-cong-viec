/**
 * @file TaskDetailModal.jsx
 * @description Premium glassmorphism modal for task details
 * Shows full task information, timeline, and actions
 */

import React, { useState, useEffect } from 'react';
import {
    FaTimes, FaEdit, FaTrash, FaCheck, FaClock, FaUser,
    FaCoins, FaHistory, FaExternalLinkAlt, FaTag, FaFlag
} from 'react-icons/fa';
import { useContractContext } from '../../contract/ContractContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { useTaskContext } from '../TaskContext';
import { formatNgay, formatDiaChi, formatSoDu } from '../../common/utils/format';
import Identicon from '../../common/components/Identicon';
import Badge from '../../common/components/Badge';
import Button from '../../common/components/Button';
import ConfirmDialog from '../../common/components/ConfirmDialog';

const TaskDetailModal = ({ task, isOpen, onClose, onEdit }) => {
    const { danhDauHoanThanh, xoaCongViec } = useContractContext();
    const { diaChiVi } = useWalletContext();
    const { capNhatTrangThaiOptimistic, rollbackTrangThai, xoaTaskOptimistic, rollbackXoa } = useTaskContext();

    const [isProcessing, setIsProcessing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [countdown, setCountdown] = useState('');

    const isOwner = diaChiVi && task?.owner?.toLowerCase() === diaChiVi.toLowerCase();
    const isAssigned = diaChiVi && task?.nguoiDuocGan?.toLowerCase() === diaChiVi.toLowerCase();
    const canToggle = isOwner || isAssigned;

    // Real-time countdown
    useEffect(() => {
        if (!task) return;

        const updateCountdown = () => {
            const now = Math.floor(Date.now() / 1000);
            const deadline = Number(task.hanChot);
            const diff = deadline - now;

            if (task.daHoanThanh) {
                setCountdown('✓ Đã hoàn thành');
                return;
            }

            if (diff < 0) {
                const absDiff = Math.abs(diff);
                const days = Math.floor(absDiff / 86400);
                const hours = Math.floor((absDiff % 86400) / 3600);
                setCountdown(`⚠️ Quá hạn ${days > 0 ? `${days}d ` : ''}${hours}h`);
            } else {
                const days = Math.floor(diff / 86400);
                const hours = Math.floor((diff % 86400) / 3600);
                const mins = Math.floor((diff % 3600) / 60);
                setCountdown(`${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m còn lại`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [task]);

    if (!isOpen || !task) return null;

    const handleToggle = async () => {
        if (!canToggle || isProcessing) return;
        const old = task.daHoanThanh;
        const next = !old;
        capNhatTrangThaiOptimistic(task.id, next);
        setIsProcessing(true);
        try {
            const result = await danhDauHoanThanh(task.id, next);
            if (!result) rollbackTrangThai(task.id, old);
        } catch {
            rollbackTrangThai(task.id, old);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!isOwner || isProcessing) return;
        const backup = { ...task };
        xoaTaskOptimistic(task.id);
        setIsProcessing(true);
        setShowDeleteConfirm(false);
        try {
            const result = await xoaCongViec(task.id);
            if (!result) rollbackXoa(backup);
            else onClose();
        } catch {
            rollbackXoa(backup);
        } finally {
            setIsProcessing(false);
        }
    };

    const priorityConfig = {
        2: { label: 'Cao', color: 'text-white', bg: 'bg-red-500/80', border: 'border-red-400', icon: '🔥' },
        1: { label: 'Trung bình', color: 'text-white', bg: 'bg-orange-500/80', border: 'border-orange-400', icon: '⚡' },
        0: { label: 'Thấp', color: 'text-white', bg: 'bg-green-500/80', border: 'border-green-400', icon: '🌱' }
    };

    const priority = priorityConfig[task.doUuTien] || priorityConfig[0];

    return (
        <>
            {/* Modal Overlay Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
                    onClick={onClose}
                />

                {/* Modal Card */}
                <div className="relative w-full max-w-2xl max-h-[90vh] animate-scale-in z-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                    <div className="glass-premium rounded-2xl overflow-hidden h-full flex flex-col border border-white/10">
                        {/* Header with gradient */}
                        <div className={`relative px-6 py-5 ${task.daHoanThanh ? 'bg-neon-green/10' : 'bg-gradient-to-r from-neon-cyan/10 to-neon-green/5'}`}>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-elevated)]" />

                            <div className="relative flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={task.daHoanThanh ? 'success' : 'info'} size="sm">
                                            {task.daHoanThanh ? 'HOÀN THÀNH' : 'ĐANG TIẾN HÀNH'}
                                        </Badge>
                                        {task.danhMuc && (
                                            <Badge variant="default" size="sm">
                                                <FaTag className="w-2.5 h-2.5 mr-1" />
                                                {task.danhMuc}
                                            </Badge>
                                        )}
                                    </div>
                                    <h2 className="font-display text-xl md:text-2xl font-bold text-primary truncate">
                                        {task.tieuDe}
                                    </h2>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg bg-surface/50 hover:bg-surface text-secondary hover:text-primary transition-all"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-2">Mô tả</h3>
                                <p className="text-secondary leading-relaxed whitespace-pre-wrap">
                                    {task.moTa || 'Không có mô tả'}
                                </p>
                            </div>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Priority */}
                                <div className={`p-4 rounded-xl ${priority.bg} border ${priority.border}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaFlag className={`w-3.5 h-3.5 ${priority.color}`} />
                                        <span className="font-mono text-xs text-muted uppercase">Độ ưu tiên</span>
                                    </div>
                                    <p className={`font-display font-bold ${priority.color} text-lg`}>
                                        {priority.icon} {priority.label}
                                    </p>
                                </div>

                                {/* Deadline */}
                                <div className="p-4 rounded-xl bg-surface border border-border">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaClock className="w-3.5 h-3.5 text-neon-orange" />
                                        <span className="font-mono text-xs text-muted uppercase">Deadline</span>
                                    </div>
                                    <p className="font-display font-semibold text-primary">
                                        {formatNgay(task.hanChot)}
                                    </p>
                                    <p className="font-mono text-xs text-secondary mt-0.5">{countdown}</p>
                                </div>
                            </div>

                            {/* People */}
                            <div className="space-y-3">
                                <h3 className="font-mono text-xs text-muted uppercase tracking-widest">Người tham gia</h3>

                                {/* Owner */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                                    <Identicon address={task.owner} size={40} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-xs text-muted">Người tạo</p>
                                        <p className="font-mono text-sm text-primary truncate">{formatDiaChi(task.owner)}</p>
                                    </div>
                                    {isOwner && <Badge variant="success" size="xs">BẠN</Badge>}
                                </div>

                                {/* Assignee */}
                                {task.nguoiDuocGan && task.nguoiDuocGan !== '0x0000000000000000000000000000000000000000' && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                                        <Identicon address={task.nguoiDuocGan} size={40} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-mono text-xs text-muted">Được gán cho</p>
                                            <p className="font-mono text-sm text-primary truncate">{formatDiaChi(task.nguoiDuocGan)}</p>
                                        </div>
                                        {isAssigned && <Badge variant="warning" size="xs">BẠN</Badge>}
                                    </div>
                                )}
                            </div>

                            {/* Reward */}
                            {task.tienThuong && task.tienThuong !== '0' && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-neon-orange/10 to-neon-yellow/10 border border-neon-orange/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-neon-orange/20">
                                                <FaCoins className="w-5 h-5 text-neon-orange" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-xs text-muted uppercase">Phần thưởng</p>
                                                <p className="font-display text-xl font-bold text-neon-orange">
                                                    {formatSoDu(task.tienThuong)}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={`https://sepolia.etherscan.io/address/${task.owner}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-secondary hover:text-primary transition-all"
                                        >
                                            <FaExternalLinkAlt className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions Footer */}
                        <div className="px-6 py-4 border-t border-border bg-surface/50">
                            <div className="flex items-center gap-3">
                                {canToggle && (
                                    <Button
                                        onClick={handleToggle}
                                        disabled={isProcessing}
                                        variant={task.daHoanThanh ? 'ghost' : 'primary'}
                                        size="md"
                                        icon={<FaCheck className="w-4 h-4" />}
                                        className="flex-1"
                                    >
                                        {task.daHoanThanh ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
                                    </Button>
                                )}

                                {isOwner && (
                                    <>
                                        <Button
                                            onClick={() => { onEdit(task); onClose(); }}
                                            variant="ghost"
                                            size="md"
                                            icon={<FaEdit className="w-4 h-4" />}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            variant="danger"
                                            size="md"
                                            icon={<FaTrash className="w-4 h-4" />}
                                        >
                                            Xóa
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDelete}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc muốn xóa "${task.tieuDe}"? Hành động này không thể hoàn tác.`}
                    confirmText="Xóa"
                    cancelText="Hủy"
                    variant="danger"
                />
            </div>
        </>
    );
};

export default TaskDetailModal;
