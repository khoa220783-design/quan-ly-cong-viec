/**
 * @file TaskList.jsx
 * @description Danh sách công việc
 */

import React, { useState } from 'react';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { useTaskContext } from '../TaskContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { TRANG_THAI, SAP_XEP } from '../../common/utils/constants';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Button from '../../common/components/Button';
import Loading from '../../common/components/Loading';

const TaskList = () => {
  
  const { danhSachCongViec, dangTai, boLoc, capNhatBoLoc } = useTaskContext();
  const { diaChiVi } = useWalletContext();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  
  /**
   * Mở form tạo mới
   */
  const handleCreate = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };
  
  /**
   * Mở form sửa
   */
  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };
  
  /**
   * Đóng form
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };
  
  /**
   * Thay đổi bộ lọc trạng thái
   */
  const handleFilterChange = (trangThai) => {
    capNhatBoLoc({ trangThai });
  };
  
  /**
   * Thay đổi sắp xếp
   */
  const handleSortChange = (e) => {
    capNhatBoLoc({ sapXep: e.target.value });
  };
  
  /**
   * Tìm kiếm
   */
  const handleSearch = (e) => {
    e.preventDefault();
    capNhatBoLoc({ tuKhoa: searchInput });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Danh sách công việc
          </h2>
          <p className="text-gray-600 mt-1">
            Tổng: {danhSachCongViec.length} công việc
          </p>
        </div>
        
        {diaChiVi && (
          <Button
            onClick={handleCreate}
            variant="primary"
          >
            <FaPlus className="w-4 h-4" />
            Tạo công việc mới
          </Button>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" variant="primary">
              <FaSearch className="w-4 h-4" />
            </Button>
          </form>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange(TRANG_THAI.TAT_CA)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                boLoc.trangThai === TRANG_THAI.TAT_CA
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => handleFilterChange(TRANG_THAI.CUA_TOI)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                boLoc.trangThai === TRANG_THAI.CUA_TOI
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={!diaChiVi}
            >
              Của tôi
            </button>
          </div>
          
          {/* Sort */}
          <select
            value={boLoc.sapXep}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="moi-nhat">Mới nhất</option>
            <option value="cu-nhat">Cũ nhất</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>
      
      {/* List */}
      {dangTai ? (
        <Loading text="Đang tải danh sách..." />
      ) : danhSachCongViec.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">
            {diaChiVi 
              ? 'Chưa có công việc nào. Hãy tạo công việc đầu tiên!'
              : 'Vui lòng kết nối ví để xem danh sách công việc'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {danhSachCongViec.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
      
      {/* Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default TaskList;
