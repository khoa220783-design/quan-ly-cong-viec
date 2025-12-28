/**
 * @file TaskCard.jsx
 * @description Premium Task Card với Glassmorphism và animations
 */

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaClock, FaUser, FaCoins, FaCheck, FaExclamationTriangle, FaUserPlus, FaGift } from 'react-icons/fa';
import { useContractContext } from '../../contract/ContractContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { useTaskContext } from '../TaskContext';
import { formatNgay, formatThoiGianConLai, formatDiaChi, formatSoDu } from '../../common/utils/format';
import Badge from '../../common/components/Badge';
import Button from '../../common/components/Button';

const TaskCard = ({ task, onEdit, index = 0 }) => {

  const { danhDauHoanThanh, xoaCongViec } = useContractContext();
  const { diaChiVi } = useWalletContext();
  const { taiDanhSach } = useTaskContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Check permissions
  const isOwner = diaChiVi && task.owner.toLowerCase() === diaChiVi.toLowerCase();
  const isAssigned = diaChiVi && task.nguoiDuocGan.toLowerCase() === diaChiVi.toLowerCase();
  const canToggle = isOwner || isAssigned;

  // Check deadline status
  const now = Math.floor(Date.now() / 1000);
  const isOverdue = Number(task.hanChot) < now && !task.daHoanThanh;
  const isNearDeadline = Number(task.hanChot) - now < 86400 && Number(task.hanChot) > now; // 24h

  // Determine status
  const getStatus = () => {
    if (task.daHoanThanh) return { variant: 'success', text: 'Hoàn thành', icon: FaCheck };
    if (isOverdue) return { variant: 'danger', text: 'Quá hạn', icon: FaExclamationTriangle };
    if (isNearDeadline) return { variant: 'warning', text: 'Sắp hết hạn', icon: FaClock };
    return { variant: 'info', text: 'Đang làm', icon: FaClock };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  // Toggle completion
  const handleToggle = async () => {
    if (!canToggle) return;

    setIsProcessing(true);
    const result = await danhDauHoanThanh(task.id, !task.daHoanThanh);
    if (result) {
      await taiDanhSach();
    }
    setIsProcessing(false);
  };

  // Delete task
  const handleDelete = async () => {
    if (!isOwner) return;

    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;

    setIsProcessing(true);
    const result = await xoaCongViec(task.id);
    if (result) {
      await taiDanhSach();
    }
    setIsProcessing(false);
  };

  return (
    <div
      className={`
        glass rounded-xl overflow-hidden
        border transition-all duration-300
        card-interactive
        animate-fade-in
        ${task.daHoanThanh
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : isOverdue
            ? 'border-red-500/20 bg-red-500/5'
            : 'border-white/10 hover:border-brand-500/30'
        }
      `}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Priority indicator bar */}
      <div className={`h-1 ${isOverdue ? 'bg-gradient-to-r from-red-500 to-red-400' :
          isNearDeadline ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
            task.daHoanThanh ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
              'bg-gradient-to-r from-brand-500 to-accent-cyan'
        }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold mb-1 truncate ${task.daHoanThanh ? 'line-through text-dark-400' : 'text-white'
              }`}>
              {task.tieuDe}
            </h3>
            <p className="text-sm text-dark-400 line-clamp-2">
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
            <FaUser className="w-3.5 h-3.5 text-dark-500" />
            <span className="text-dark-400">{formatDiaChi(task.owner)}</span>
            {isOwner && (
              <Badge variant="brand" size="xs">Của bạn</Badge>
            )}
          </div>

          {/* Assigned */}
          {task.nguoiDuocGan !== '0x0000000000000000000000000000000000000000' && (
            <div className="flex items-center gap-2 text-sm">
              <FaUserPlus className="w-3.5 h-3.5 text-dark-500" />
              <span className="text-dark-400">{formatDiaChi(task.nguoiDuocGan)}</span>
              {isAssigned && (
                <Badge variant="info" size="xs">Được giao</Badge>
              )}
            </div>
          )}

          {/* Deadline */}
          <div className="flex items-center gap-2 text-sm">
            <FaClock className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-400' :
                isNearDeadline ? 'text-amber-400' :
                  'text-dark-500'
              }`} />
            <span className={`${isOverdue ? 'text-red-400' :
                isNearDeadline ? 'text-amber-400' :
                  'text-dark-400'
              }`}>
              {formatNgay(task.hanChot)}
            </span>
            <span className="text-dark-500 text-xs">
              ({formatThoiGianConLai(task.hanChot)})
            </span>
          </div>

          {/* Reward */}
          {task.tienThuong !== '0' && (
            <div className="flex items-center gap-2 text-sm">
              <FaCoins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-medium">
                {formatSoDu(task.tienThuong)}
              </span>
              {task.daHoanThanh && isAssigned && !task.daClaimReward && (
                <Badge variant="success" size="xs" pulse>
                  <FaGift className="w-3 h-3 mr-1" />
                  Có thể nhận
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={`
          flex items-center gap-2 pt-4 border-t border-white/5
          transition-opacity duration-200
          ${showActions || isProcessing ? 'opacity-100' : 'opacity-60'}
        `}>
          {/* Checkbox Toggle */}
          {canToggle && (
            <button
              onClick={handleToggle}
              disabled={isProcessing}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                text-sm font-medium transition-all
                ${task.daHoanThanh
                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <div className={`
                w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                ${task.daHoanThanh
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-dark-500'
                }
              `}>
                {task.daHoanThanh && (
                  <FaCheck className="w-2.5 h-2.5 text-white" />
                )}
              </div>
              <span>{task.daHoanThanh ? 'Đã xong' : 'Hoàn thành'}</span>
            </button>
          )}

          <div className="flex-1" />

          {/* Edit Button */}
          {isOwner && !task.daHoanThanh && (
            <button
              onClick={() => onEdit(task)}
              disabled={isProcessing}
              className="p-2.5 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
              title="Sửa"
            >
              <FaEdit className="w-4 h-4" />
            </button>
          )}

          {/* Delete Button */}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isProcessing}
              className="p-2.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Xóa"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
