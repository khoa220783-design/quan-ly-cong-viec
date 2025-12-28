/**
 * @file TaskCard.jsx
 * @description Premium Task Card với ConfirmDialog và optimistic updates
 */

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaClock, FaUser, FaCoins, FaCheck, FaExclamationTriangle, FaUserPlus, FaGift } from 'react-icons/fa';
import { useContractContext } from '../../contract/ContractContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { useTaskContext } from '../TaskContext';
import { formatNgay, formatThoiGianConLai, formatDiaChi, formatSoDu } from '../../common/utils/format';
import Badge from '../../common/components/Badge';
import ConfirmDialog from '../../common/components/ConfirmDialog';

const TaskCard = ({ task, onEdit, index = 0 }) => {

  const { danhDauHoanThanh, xoaCongViec } = useContractContext();
  const { diaChiVi } = useWalletContext();
  const {
    capNhatTrangThaiOptimistic,
    rollbackTrangThai,
    xoaTaskOptimistic,
    rollbackXoa
  } = useTaskContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState(null); // 'toggle' | 'delete'
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Check permissions
  const isOwner = diaChiVi && task.owner.toLowerCase() === diaChiVi.toLowerCase();
  const isAssigned = diaChiVi && task.nguoiDuocGan.toLowerCase() === diaChiVi.toLowerCase();
  const canToggle = isOwner || isAssigned;

  // Check deadline status
  const now = Math.floor(Date.now() / 1000);
  const isOverdue = Number(task.hanChot) < now && !task.daHoanThanh;
  const isNearDeadline = Number(task.hanChot) - now < 86400 && Number(task.hanChot) > now;

  // Determine status
  const getStatus = () => {
    if (task.daHoanThanh) return { variant: 'success', text: 'Hoàn thành', icon: FaCheck };
    if (isOverdue) return { variant: 'danger', text: 'Quá hạn', icon: FaExclamationTriangle };
    if (isNearDeadline) return { variant: 'warning', text: 'Sắp hết hạn', icon: FaClock };
    return { variant: 'info', text: 'Đang làm', icon: FaClock };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  /**
   * Toggle completion với optimistic update
   */
  const handleToggle = async () => {
    if (!canToggle || isProcessing) return;

    const trangThaiCu = task.daHoanThanh;
    const trangThaiMoi = !trangThaiCu;

    // Optimistic update - cập nhật UI ngay lập tức
    capNhatTrangThaiOptimistic(task.id, trangThaiMoi);
    setIsProcessing(true);
    setProcessingAction('toggle');

    try {
      const result = await danhDauHoanThanh(task.id, trangThaiMoi);

      if (!result) {
        // Transaction failed - rollback
        rollbackTrangThai(task.id, trangThaiCu);
      }
      // Transaction success - UI đã cập nhật rồi, không cần làm gì thêm
    } catch (error) {
      // Error - rollback
      rollbackTrangThai(task.id, trangThaiCu);
      console.error('Lỗi khi cập nhật:', error);
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  /**
   * Delete task với ConfirmDialog và optimistic update
   */
  const handleDelete = async () => {
    if (!isOwner || isProcessing) return;

    // Optimistic update - xóa khỏi UI ngay
    const deletedTask = xoaTaskOptimistic(task.id);
    setShowDeleteDialog(false);
    setIsProcessing(true);
    setProcessingAction('delete');

    try {
      const result = await xoaCongViec(task.id);

      if (!result) {
        // Transaction failed - rollback
        rollbackXoa(deletedTask);
      }
    } catch (error) {
      // Error - rollback
      rollbackXoa(deletedTask);
      console.error('Lỗi khi xóa:', error);
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  return (
    <>
      <div
        className={`
          bg-white dark:bg-zinc-800/50
          rounded-2xl overflow-hidden
          border transition-all duration-300
          hover:shadow-lg dark:hover:shadow-zinc-900/50
          ${isProcessing ? 'opacity-70 pointer-events-none' : ''}
          ${task.daHoanThanh
            ? 'border-emerald-200 dark:border-emerald-500/20'
            : isOverdue
              ? 'border-red-200 dark:border-red-500/20'
              : 'border-zinc-200 dark:border-zinc-700/50 hover:border-violet-300 dark:hover:border-violet-500/30'
          }
        `}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Priority indicator bar */}
        <div className={`h-1 ${isOverdue ? 'bg-gradient-to-r from-red-400 to-red-500' :
            isNearDeadline ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
              task.daHoanThanh ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                'bg-gradient-to-r from-violet-400 to-cyan-400'
          }`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className={`text-base font-semibold mb-1 truncate ${task.daHoanThanh
                  ? 'line-through text-zinc-400 dark:text-zinc-500'
                  : 'text-zinc-800 dark:text-zinc-100'
                }`}>
                {task.tieuDe}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {task.moTa}
              </p>
            </div>

            {/* Status Badge */}
            <Badge
              variant={status.variant}
              size="sm"
              icon={<StatusIcon className="w-3 h-3" />}
            >
              {status.text}
            </Badge>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 mb-4">
            {/* Owner */}
            <div className="flex items-center gap-2 text-sm">
              <FaUser className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              <span className="text-zinc-500 dark:text-zinc-400">{formatDiaChi(task.owner)}</span>
              {isOwner && (
                <Badge variant="brand" size="xs">Của bạn</Badge>
              )}
            </div>

            {/* Assigned */}
            {task.nguoiDuocGan !== '0x0000000000000000000000000000000000000000' && (
              <div className="flex items-center gap-2 text-sm">
                <FaUserPlus className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                <span className="text-zinc-500 dark:text-zinc-400">{formatDiaChi(task.nguoiDuocGan)}</span>
                {isAssigned && (
                  <Badge variant="info" size="xs">Được giao</Badge>
                )}
              </div>
            )}

            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm">
              <FaClock className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-400' :
                  isNearDeadline ? 'text-amber-400' :
                    'text-zinc-400 dark:text-zinc-500'
                }`} />
              <span className={`${isOverdue ? 'text-red-500 dark:text-red-400' :
                  isNearDeadline ? 'text-amber-500 dark:text-amber-400' :
                    'text-zinc-500 dark:text-zinc-400'
                }`}>
                {formatNgay(task.hanChot)}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500 text-xs">
                ({formatThoiGianConLai(task.hanChot)})
              </span>
            </div>

            {/* Reward */}
            {task.tienThuong !== '0' && (
              <div className="flex items-center gap-2 text-sm">
                <FaCoins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-500 dark:text-amber-400 font-medium">
                  {formatSoDu(task.tienThuong)}
                </span>
                {task.daHoanThanh && isAssigned && !task.daNhanThuong && (
                  <Badge variant="success" size="xs" pulse>
                    <FaGift className="w-3 h-3 mr-1" />
                    Có thể nhận
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
            {/* Checkbox Toggle */}
            {canToggle && (
              <button
                onClick={handleToggle}
                disabled={isProcessing}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl
                  text-sm font-medium transition-all
                  disabled:opacity-50
                  ${task.daHoanThanh
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                    : 'bg-zinc-50 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }
                `}
              >
                {processingAction === 'toggle' ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <div className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                    ${task.daHoanThanh
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-zinc-300 dark:border-zinc-500'
                    }
                  `}>
                    {task.daHoanThanh && (
                      <FaCheck className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                )}
                <span>{task.daHoanThanh ? 'Đã xong' : 'Hoàn thành'}</span>
              </button>
            )}

            <div className="flex-1" />

            {/* Edit Button */}
            {isOwner && !task.daHoanThanh && (
              <button
                onClick={() => onEdit(task)}
                disabled={isProcessing}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors disabled:opacity-50"
                title="Sửa"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            )}

            {/* Delete Button */}
            {isOwner && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isProcessing}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                title="Xóa"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa công việc"
        message={`Bạn có chắc chắn muốn xóa "${task.tieuDe}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={processingAction === 'delete'}
      />
    </>
  );
};

export default TaskCard;
