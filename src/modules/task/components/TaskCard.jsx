/**
 * @file TaskCard.jsx
 * @description Card hiển thị một công việc
 */

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaClock, FaUser, FaCoins } from 'react-icons/fa';
import { useContractContext } from '../../contract/ContractContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { useTaskContext } from '../TaskContext';
import { formatNgay, formatThoiGianConLai, formatDiaChi, formatSoDu } from '../../common/utils/format';
import Badge from '../../common/components/Badge';
import Button from '../../common/components/Button';

const TaskCard = ({ task, onEdit }) => {
  
  const { danhDauHoanThanh, xoaCongViec } = useContractContext();
  const { diaChiVi } = useWalletContext();
  const { taiDanhSach } = useTaskContext();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check quyền
  const isOwner = diaChiVi && task.owner.toLowerCase() === diaChiVi.toLowerCase();
  const isAssigned = diaChiVi && task.nguoiDuocGan.toLowerCase() === diaChiVi.toLowerCase();
  const canToggle = isOwner || isAssigned;
  
  // Check deadline
  const now = Math.floor(Date.now() / 1000);
  const isOverdue = Number(task.hanChot) < now && !task.daHoanThanh;
  
  /**
   * Toggle hoàn thành
   */
  const handleToggle = async () => {
    if (!canToggle) return;
    
    setIsProcessing(true);
    const result = await danhDauHoanThanh(task.id, !task.daHoanThanh);
    if (result) {
      await taiDanhSach();
    }
    setIsProcessing(false);
  };
  
  /**
   * Xóa công việc
   */
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
    <div className={`bg-white rounded-lg shadow-sm border-2 p-4 hover:shadow-md transition-shadow ${
      task.daHoanThanh ? 'border-green-200 bg-green-50' : 
      isOverdue ? 'border-red-200 bg-red-50' : 
      'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${
            task.daHoanThanh ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.tieuDe}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {task.moTa}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className="ml-3">
          {task.daHoanThanh ? (
            <Badge variant="success">Hoàn thành</Badge>
          ) : isOverdue ? (
            <Badge variant="danger">Quá hạn</Badge>
          ) : (
            <Badge variant="info">Đang làm</Badge>
          )}
        </div>
      </div>
      
      {/* Info */}
      <div className="space-y-2 mb-4">
        {/* Owner */}
        <div className="flex items-center text-sm text-gray-600">
          <FaUser className="w-4 h-4 mr-2" />
          <span>{formatDiaChi(task.owner)}</span>
          {isOwner && (
            <Badge variant="info" className="ml-2">Của bạn</Badge>
          )}
        </div>
        
        {/* Deadline */}
        <div className="flex items-center text-sm text-gray-600">
          <FaClock className="w-4 h-4 mr-2" />
          <span>{formatNgay(task.hanChot)}</span>
          <span className="ml-2 text-xs">
            ({formatThoiGianConLai(task.hanChot)})
          </span>
        </div>
        
        {/* Reward */}
        {task.tienThuong !== '0' && (
          <div className="flex items-center text-sm text-purple-600 font-medium">
            <FaCoins className="w-4 h-4 mr-2" />
            <span>Thưởng: {formatSoDu(task.tienThuong)}</span>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t">
        {/* Checkbox */}
        {canToggle && (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.daHoanThanh}
              onChange={handleToggle}
              disabled={isProcessing}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {task.daHoanThanh ? 'Đã xong' : 'Hoàn thành'}
            </span>
          </label>
        )}
        
        <div className="flex-1" />
        
        {/* Edit Button */}
        {isOwner && !task.daHoanThanh && (
          <button
            onClick={() => onEdit(task)}
            disabled={isProcessing}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
