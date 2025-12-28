/**
 * @file TaskForm.jsx
 * @description Form tạo/sửa công việc
 */

import React, { useState, useEffect } from 'react';
import { useContractContext } from '../../contract/ContractContext';
import { useTaskContext } from '../TaskContext';
import { validateFormCongViec } from '../../common/utils/validate';
import { parseDateTimeLocal, formatDateTimeLocal } from '../../common/utils/format';
import Button from '../../common/components/Button';
import Modal from '../../common/components/Modal';

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
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Sửa công việc' : 'Tạo công việc mới'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tieuDe"
            value={formData.tieuDe}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.tieuDe ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập tiêu đề công việc"
          />
          {errors.tieuDe && (
            <p className="mt-1 text-sm text-red-500">{errors.tieuDe}</p>
          )}
        </div>
        
        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            name="moTa"
            value={formData.moTa}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.moTa ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập mô tả chi tiết"
          />
          {errors.moTa && (
            <p className="mt-1 text-sm text-red-500">{errors.moTa}</p>
          )}
        </div>
        
        {/* Hạn chót */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hạn chót <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="hanChot"
            value={formData.hanChot}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.hanChot ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.hanChot && (
            <p className="mt-1 text-sm text-red-500">{errors.hanChot}</p>
          )}
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
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
