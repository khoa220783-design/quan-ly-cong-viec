/**
 * @file TaskForm.jsx
 * @description Form tạo/sửa công việc với light/dark support
 */

import React, { useState, useEffect } from 'react';
import { useContractContext } from '../../contract/ContractContext';
import { useTaskContext } from '../TaskContext';
import { validateFormCongViec } from '../../common/utils/validate';
import { parseDateTimeLocal, formatDateTimeLocal } from '../../common/utils/format';
import Button from '../../common/components/Button';
import Modal from '../../common/components/Modal';
import { FaCalendarAlt, FaFileAlt, FaHeading, FaInfoCircle } from 'react-icons/fa';

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

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        tieuDe: taskToEdit.tieuDe,
        moTa: taskToEdit.moTa,
        hanChot: formatDateTimeLocal(taskToEdit.hanChot)
      });
    } else {
      setFormData({ tieuDe: '', moTa: '', hanChot: '' });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        result = await suaCongViec(taskToEdit.id, formData.tieuDe, formData.moTa, hanChotTimestamp);
      } else {
        result = await taoCongViec(formData.tieuDe, formData.moTa, hanChotTimestamp);
      }

      if (result) {
        await taiDanhSach();
        onClose();
      }
    } catch (error) {
      console.error('Lỗi khi submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) => `
    w-full px-4 py-3 pl-11
    bg-zinc-50 dark:bg-zinc-700/50 
    border rounded-xl
    text-zinc-800 dark:text-white
    placeholder:text-zinc-400 dark:placeholder:text-zinc-500
    focus:outline-none focus:ring-2 focus:ring-violet-500/50
    transition-all
    ${errors[fieldName]
      ? 'border-red-300 dark:border-red-500/50'
      : 'border-zinc-200 dark:border-zinc-600 focus:border-violet-500 dark:focus:border-violet-500'
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
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              name="tieuDe"
              value={formData.tieuDe}
              onChange={handleChange}
              className={inputClass('tieuDe')}
              placeholder="Nhập tiêu đề công việc"
            />
          </div>
          {errors.tieuDe && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <FaInfoCircle className="w-3.5 h-3.5" />
              {errors.tieuDe}
            </p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaFileAlt className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              rows={4}
              className={`${inputClass('moTa')} resize-none`}
              placeholder="Mô tả chi tiết công việc..."
            />
          </div>
          {errors.moTa && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <FaInfoCircle className="w-3.5 h-3.5" />
              {errors.moTa}
            </p>
          )}
        </div>

        {/* Hạn chót */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Hạn chót <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="datetime-local"
              name="hanChot"
              value={formData.hanChot}
              onChange={handleChange}
              className={inputClass('hanChot')}
            />
          </div>
          {errors.hanChot && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <FaInfoCircle className="w-3.5 h-3.5" />
              {errors.hanChot}
            </p>
          )}
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
          <p className="text-sm text-violet-700 dark:text-violet-300">
            <span className="font-medium">💡 Lưu ý:</span> Công việc sẽ được lưu trên blockchain.
            Bạn cần xác nhận giao dịch trong MetaMask.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-700">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" variant="gradient" loading={isSubmitting} disabled={isSubmitting}>
            {taskToEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
