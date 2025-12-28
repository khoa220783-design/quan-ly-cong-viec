/**
 * @file TaskForm.jsx
 * @description Terminal-style Task Form
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useContractContext } from '../../contract/ContractContext';
import { useTaskContext } from '../TaskContext';
import { validateFormCongViec } from '../../common/utils/validate';
import { parseDateTimeLocal, formatDateTimeLocal } from '../../common/utils/format';
import Button from '../../common/components/Button';
import Modal from '../../common/components/Modal';
import { FaTerminal } from 'react-icons/fa';

const TaskForm = ({ isOpen, onClose, taskToEdit = null }) => {
  const { taoCongViec, suaCongViec } = useContractContext();
  const { taiDanhSach } = useTaskContext();

  const [formData, setFormData] = useState({ tieuDe: '', moTa: '', hanChot: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        tieuDe: taskToEdit.tieuDe,
        moTa: taskToEdit.moTa,
        hanChot: formatDateTimeLocal(taskToEdit.hanChot),
      });
    } else {
      setFormData({ tieuDe: '', moTa: '', hanChot: '' });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hanChotTimestamp = parseDateTimeLocal(formData.hanChot);
    const validation = validateFormCongViec({ tieuDe: formData.tieuDe, moTa: formData.moTa, hanChot: hanChotTimestamp });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = taskToEdit
        ? await suaCongViec(taskToEdit.id, formData.tieuDe, formData.moTa, hanChotTimestamp)
        : await taoCongViec(formData.tieuDe, formData.moTa, hanChotTimestamp);
      if (result) {
        await taiDanhSach();
        onClose();
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoize input classes to prevent re-renders
  const inputClasses = useMemo(() => ({
    tieuDe: `w-full px-4 py-3 bg-surface border rounded-lg font-mono text-sm text-primary placeholder:text-dim focus:outline-none focus:border-neon-green transition-colors ${errors.tieuDe ? 'border-neon-red' : 'border-border'}`,
    moTa: `w-full px-4 py-3 bg-surface border rounded-lg font-mono text-sm text-primary placeholder:text-dim focus:outline-none focus:border-neon-green transition-colors resize-none ${errors.moTa ? 'border-neon-red' : 'border-border'}`,
    hanChot: `w-full px-4 py-3 bg-surface border rounded-lg font-mono text-sm text-primary placeholder:text-dim focus:outline-none focus:border-neon-green transition-colors ${errors.hanChot ? 'border-neon-red' : 'border-border'}`,
  }), [errors]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? 'edit.task' : 'create.task'} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
            Title <span className="text-neon-red">*</span>
          </label>
          <input
            type="text"
            name="tieuDe"
            value={formData.tieuDe}
            onChange={handleChange}
            className={inputClasses.tieuDe}
            placeholder="Enter task title..."
            autoFocus
          />
          {errors.tieuDe && (
            <p className="mt-1 font-mono text-xs text-neon-red"># Error: {errors.tieuDe}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
            Description <span className="text-neon-red">*</span>
          </label>
          <textarea
            name="moTa"
            value={formData.moTa}
            onChange={handleChange}
            rows={4}
            className={inputClasses.moTa}
            placeholder="Enter task description..."
          />
          {errors.moTa && (
            <p className="mt-1 font-mono text-xs text-neon-red"># Error: {errors.moTa}</p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
            Deadline <span className="text-neon-red">*</span>
          </label>
          <input
            type="datetime-local"
            name="hanChot"
            value={formData.hanChot}
            onChange={handleChange}
            className={inputClasses.hanChot}
          />
          {errors.hanChot && (
            <p className="mt-1 font-mono text-xs text-neon-red"># Error: {errors.hanChot}</p>
          )}
        </div>

        {/* Info */}
        <div className="p-4 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20">
          <p className="font-mono text-xs text-neon-cyan">
            <FaTerminal className="inline w-3 h-3 mr-2" />
            Transaction will be signed via MetaMask
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            CANCEL
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            {taskToEdit ? 'UPDATE' : 'CREATE'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
