/**
 * @file TaskCard.jsx
 * @description Neo-Brutalist Task Card với terminal aesthetic
 */

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaClock, FaUser, FaCoins, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useContractContext } from '../../contract/ContractContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { useTaskContext } from '../TaskContext';
import { formatNgay, formatThoiGianConLai, formatDiaChi, formatSoDu } from '../../common/utils/format';
import Badge from '../../common/components/Badge';
import ConfirmDialog from '../../common/components/ConfirmDialog';

const TaskCard = ({ task, onEdit, index = 0 }) => {
  const { danhDauHoanThanh, xoaCongViec } = useContractContext();
  const { diaChiVi } = useWalletContext();
  const { capNhatTrangThaiOptimistic, rollbackTrangThai, xoaTaskOptimistic, rollbackXoa } = useTaskContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = diaChiVi && task.owner.toLowerCase() === diaChiVi.toLowerCase();
  const isAssigned = diaChiVi && task.nguoiDuocGan.toLowerCase() === diaChiVi.toLowerCase();
  const canToggle = isOwner || isAssigned;

  const now = Math.floor(Date.now() / 1000);
  const isOverdue = Number(task.hanChot) < now && !task.daHoanThanh;
  const isNearDeadline = Number(task.hanChot) - now < 86400 && Number(task.hanChot) > now;

  const handleToggle = async () => {
    if (!canToggle || isProcessing) return;
    const old = task.daHoanThanh;
    const next = !old;
    capNhatTrangThaiOptimistic(task.id, next);
    setIsProcessing(true);
    setProcessingAction('toggle');
    try {
      const result = await danhDauHoanThanh(task.id, next);
      if (!result) rollbackTrangThai(task.id, old);
    } catch {
      rollbackTrangThai(task.id, old);
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || isProcessing) return;
    const deleted = xoaTaskOptimistic(task.id);
    setShowDeleteDialog(false);
    setIsProcessing(true);
    setProcessingAction('delete');
    try {
      const result = await xoaCongViec(task.id);
      if (!result) rollbackXoa(deleted);
    } catch {
      rollbackXoa(deleted);
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  // Status config
  const status = task.daHoanThanh
    ? { variant: 'success', text: 'XONG' }
    : isOverdue
      ? { variant: 'danger', text: 'QUÁ HẠN' }
      : isNearDeadline
        ? { variant: 'warning', text: 'GẤP' }
        : { variant: 'info', text: 'ĐANG CHẠY' };

  return (
    <>
      <div
        className={`
          group relative
          bg-surface-elevated border rounded-xl overflow-hidden
          transition-all duration-300
          ${isProcessing ? 'opacity-60 pointer-events-none' : ''}
          ${task.daHoanThanh
            ? 'border-neon-green/20'
            : isOverdue
              ? 'border-neon-red/30'
              : 'border-border hover:border-border-strong hover:shadow-neon-green/5'
          }
        `}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Status bar top */}
        <div className={`h-0.5 ${task.daHoanThanh ? 'bg-neon-green' :
          isOverdue ? 'bg-neon-red' :
            isNearDeadline ? 'bg-neon-orange' :
              'bg-neon-cyan'
          }`} />

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-display font-semibold text-sm truncate ${task.daHoanThanh ? 'line-through text-muted' : 'text-primary'
                  }`}>
                  {task.tieuDe}
                </h3>
                {task.danhMuc && (
                  <Badge variant="default" size="xs">
                    {task.danhMuc}
                  </Badge>
                )}
                {task.doUuTien !== undefined && (
                  <Badge
                    variant={task.doUuTien === 2 ? 'danger' : task.doUuTien === 1 ? 'warning' : 'default'}
                    size="xs"
                  >
                    {task.doUuTien === 2 ? '🔴 CAO' : task.doUuTien === 1 ? '🟡 TB' : '🟢 THẤP'}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-secondary line-clamp-2 leading-relaxed mt-1">
                {task.moTa}
              </p>
            </div>
            <Badge variant={status.variant} size="xs">
              {status.text}
            </Badge>
          </div>

          {/* Meta info */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <FaUser className="w-3 h-3" />
              <span>{formatDiaChi(task.owner)}</span>
              {isOwner && <Badge variant="success" size="xs">BẠN</Badge>}
            </div>

            <div className={`flex items-center gap-2 font-mono text-xs ${isOverdue ? 'text-neon-red' :
              isNearDeadline ? 'text-neon-orange' :
                'text-muted'
              }`}>
              <FaClock className="w-3 h-3" />
              <span>{formatNgay(task.hanChot)}</span>
              <span className="text-dim">({formatThoiGianConLai(task.hanChot)})</span>
            </div>

            {task.tienThuong !== '0' && (
              <div className="flex items-center gap-2 font-mono text-xs text-neon-orange">
                <FaCoins className="w-3 h-3" />
                <span>{formatSoDu(task.tienThuong)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            {canToggle && (
              <button
                onClick={handleToggle}
                disabled={isProcessing}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg
                  font-mono text-xs font-medium
                  transition-all duration-200
                  ${task.daHoanThanh
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                    : 'bg-surface-hover text-secondary border border-border hover:text-neon-green hover:border-neon-green/50'
                  }
                `}
              >
                {processingAction === 'toggle' ? (
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${task.daHoanThanh ? 'bg-neon-green border-neon-green' : 'border-current'
                    }`}>
                    {task.daHoanThanh && <FaCheck className="w-2 h-2 text-neutral-950" />}
                  </div>
                )}
                {task.daHoanThanh ? 'XONG' : 'HOÀN THÀNH'}
              </button>
            )}

            <div className="flex-1" />

            {isOwner && !task.daHoanThanh && (
              <button
                onClick={() => onEdit(task)}
                className="p-2 rounded-lg text-muted hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
              >
                <FaEdit className="w-3.5 h-3.5" />
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 rounded-lg text-muted hover:text-neon-red hover:bg-neon-red/10 transition-colors"
              >
                <FaTrash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="xoa.cong_viec"
        message={`rm -rf "${task.tieuDe}"? Hành động này không thể hoàn tác.`}
        confirmText="XÓA"
        cancelText="HỦY BỎ"
        variant="danger"
        isLoading={processingAction === 'delete'}
      />
    </>
  );
};

export default TaskCard;
