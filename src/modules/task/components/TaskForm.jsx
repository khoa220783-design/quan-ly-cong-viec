/**
 * @file TaskForm.jsx
 * @description Premium Form tạo/sửa công việc với dark theme
 */

import React, { useState, useEffect } from 'react';
import { useContractContext } from '../../contract/ContractContext';
import { useTaskContext } from '../TaskContext';
import { validateFormCongViec } from '../../common/utils/validate';
import { parseDateTimeLocal, formatDateTimeLocal } from '../../common/utils/format';
import Button from '../../common/components/Button';
import Modal from '../../common/components/Modal';
import { FaCalendarAlt, FaFileAlt, FaHeading } from 'react-icons/fa';

const TaskForm = ({ isOpen, onClose, taskToEdit = null }) => {

  const { taoCongViec, suaCongViec } = useContractContext();
  const { taiDanhSach } = useTaskContext();

  const [formData, setFormData] = useState({
    tieuDe: '',
    moTa: '',
    hanChot: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data nếu đang sửa
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        tieuDe: taskToEdit.tieuDe,
        moTa: taskToEdit.moTa,
        hanChot: formatDateTimeLocal(taskToEdit.hanChot)
      });
    } else {
      setFormData({
        tieuDe: '',
        moTa: '',
        hanChot: ''
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error khi user nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const hanChotTimestamp = parseDateTimeLocal(formData.hanChot);
    const validation = validateFormCongViec({
      tieuDe: formData.tieuDe,
      moTa: formData.moTa,
      hanChot: hanChotTimestamp
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (taskToEdit) {
        // Sửa
        result = await suaCongViec(
          taskToEdit.id,
          formData.tieuDe,
          formData.moTa,
          hanChotTimestamp
        );
      } else {
        // Tạo mới
        result = await taoCongViec(
          formData.tieuDe,
          formData.moTa,
          hanChotTimestamp
        );
      }

      if (result) {
        // Thành công
        await taiDanhSach();
        onClose();
      }
    } catch (error) {
      console.error('Lỗi khi submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input class helper
  const getInputClass = (fieldName) => `
    w-full px-4 py-3 pl-11
    bg-dark-800/50 border rounded-xl
    text-white placeholder:text-dark-500
    focus:outline-none focus:ring-2 focus:ring-brand-500/50
    transition-all
    ${errors[fieldName]
      ? 'border-red-500/50 focus:border-red-500'
      : 'border-white/10 focus:border-brand-500/50'
    }
  `;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Sửa công việc' : 'Tạo công việc mới'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Tiêu đề <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              name="tieuDe"
              value={formData.tieuDe}
              onChange={handleChange}
              className={getInputClass('tieuDe')}
              placeholder="Nhập tiêu đề công việc"
            />
          </div>
          {errors.tieuDe && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.tieuDe}
            </p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Mô tả <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <FaFileAlt className="absolute left-4 top-4 w-4 h-4 text-dark-500" />
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              rows={4}
              className={`${getInputClass('moTa')} resize-none`}
              placeholder="Nhập mô tả chi tiết công việc..."
            />
          </div>
          {errors.moTa && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.moTa}
            </p>
          )}
          <p className="mt-2 text-xs text-dark-500">
            Mô tả chi tiết giúp bạn và người được giao hiểu rõ công việc
          </p>
        </div>

        {/* Hạn chót */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Hạn chót <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="datetime-local"
              name="hanChot"
              value={formData.hanChot}
              onChange={handleChange}
              className={getInputClass('hanChot')}
            />
          </div>
          {errors.hanChot && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.hanChot}
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
          <p className="text-sm text-dark-300">
            <span className="text-brand-400 font-medium">💡 Lưu ý:</span> Công việc sẽ được lưu trên blockchain Ethereum.
            Bạn sẽ cần xác nhận giao dịch trong MetaMask.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="gradient"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {taskToEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
