/**
 * @file TaskList.jsx
 * @description Premium Task List với light/dark support
 */

import React, { useState, useMemo } from 'react';
import { FaPlus, FaSearch, FaTh, FaList, FaCheckCircle, FaClock, FaExclamationTriangle, FaCoins } from 'react-icons/fa';
import { useTaskContext } from '../TaskContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { TRANG_THAI } from '../../common/utils/constants';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Button from '../../common/components/Button';
import { TaskCardSkeleton } from '../../common/components/Loading';

const TaskList = () => {

  const { danhSachCongViec, dangTai, boLoc, capNhatBoLoc } = useTaskContext();
  const { diaChiVi } = useWalletContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Calculate stats
  const stats = useMemo(() => {
    const total = danhSachCongViec.length;
    const completed = danhSachCongViec.filter(t => t.daHoanThanh).length;
    const now = Math.floor(Date.now() / 1000);
    const overdue = danhSachCongViec.filter(t => !t.daHoanThanh && Number(t.hanChot) < now).length;
    const totalReward = danhSachCongViec.reduce((sum, t) => {
      const reward = parseFloat(t.tienThuong) || 0;
      return sum + reward;
    }, 0);

    return { total, completed, overdue, totalReward };
  }, [danhSachCongViec]);

  const handleCreate = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    capNhatBoLoc({ tuKhoa: searchInput });
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, label, value, color, subValue }) => (
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-800 dark:text-white">{value}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        </div>
      </div>
      {subValue && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">{subValue}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
            Công việc của bạn
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Quản lý và theo dõi tiến độ trên blockchain
          </p>
        </div>

        {diaChiVi && (
          <Button
            onClick={handleCreate}
            variant="gradient"
            icon={<FaPlus className="w-4 h-4" />}
          >
            Tạo mới
          </Button>
        )}
      </div>

      {/* Stats Dashboard */}
      {diaChiVi && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={FaList}
            label="Tổng công việc"
            value={stats.total}
            color="bg-violet-500"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Hoàn thành"
            value={stats.completed}
            color="bg-emerald-500"
            subValue={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : null}
          />
          <StatCard
            icon={FaExclamationTriangle}
            label="Quá hạn"
            value={stats.overdue}
            color={stats.overdue > 0 ? "bg-red-500" : "bg-zinc-400"}
          />
          <StatCard
            icon={FaCoins}
            label="Tổng thưởng"
            value={stats.totalReward.toFixed(3)}
            color="bg-amber-500"
            subValue="ETH"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm..."
                className="
                  w-full pl-10 pr-4 py-2.5
                  bg-zinc-50 dark:bg-zinc-700/50 
                  border border-zinc-200 dark:border-zinc-600 rounded-xl
                  text-zinc-800 dark:text-white
                  placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                  focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                  transition-all
                "
              />
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => capNhatBoLoc({ trangThai: TRANG_THAI.TAT_CA })}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${boLoc.trangThai === TRANG_THAI.TAT_CA
                  ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400'
                  : 'bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }
              `}
            >
              Tất cả
            </button>
            <button
              onClick={() => capNhatBoLoc({ trangThai: TRANG_THAI.CUA_TOI })}
              disabled={!diaChiVi}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${boLoc.trangThai === TRANG_THAI.CUA_TOI
                  ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400'
                  : 'bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }
              `}
            >
              Của tôi
            </button>
          </div>

          {/* Sort */}
          <select
            value={boLoc.sapXep}
            onChange={(e) => capNhatBoLoc({ sapXep: e.target.value })}
            className="
              px-4 py-2.5
              bg-zinc-50 dark:bg-zinc-700/50 
              border border-zinc-200 dark:border-zinc-600 rounded-xl
              text-zinc-700 dark:text-zinc-200 text-sm
              focus:outline-none focus:border-violet-500
              cursor-pointer
            "
          >
            <option value="moi-nhat">Mới nhất</option>
            <option value="cu-nhat">Cũ nhất</option>
            <option value="deadline">Deadline</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-700/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-2 rounded-lg transition-all
                ${viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-600 text-violet-500 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }
              `}
            >
              <FaTh className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-2 rounded-lg transition-all
                ${viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-600 text-violet-500 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }
              `}
            >
              <FaList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {dangTai ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[...Array(6)].map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : danhSachCongViec.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">
            {diaChiVi ? 'Chưa có công việc nào' : 'Kết nối ví để bắt đầu'}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
            {diaChiVi
              ? 'Tạo công việc đầu tiên để bắt đầu quản lý trên blockchain!'
              : 'Kết nối ví MetaMask để xem và quản lý công việc'
            }
          </p>
          {diaChiVi && (
            <Button onClick={handleCreate} variant="gradient" icon={<FaPlus className="w-4 h-4" />}>
              Tạo mới
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {danhSachCongViec.map((task, index) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} index={index} />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <TaskForm isOpen={isFormOpen} onClose={handleCloseForm} taskToEdit={taskToEdit} />
    </div>
  );
};

export default TaskList;
