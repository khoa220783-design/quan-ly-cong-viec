/**
 * @file TaskList.jsx
 * @description Neo-Brutalist Task List với Bento Grid layout
 */

import React, { useState, useMemo } from 'react';
import { ethers } from 'ethers';
import { FaPlus, FaSearch, FaTh, FaList, FaCheckCircle, FaClock, FaExclamationTriangle, FaCoins, FaTerminal } from 'react-icons/fa';
import { useTaskContext } from '../TaskContext';
import { useWalletContext } from '../../wallet/WalletContext';
import { TRANG_THAI } from '../../common/utils/constants';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Button from '../../common/components/Button';
import Select from '../../common/components/Select';
import { TaskCardSkeleton } from '../../common/components/Loading';

const TaskList = () => {
  const { danhSachCongViec, dangTai, boLoc, capNhatBoLoc } = useTaskContext();
  const { diaChiVi } = useWalletContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Stats
  const stats = useMemo(() => {
    const total = danhSachCongViec.length;
    const completed = danhSachCongViec.filter(t => t.daHoanThanh).length;
    const now = Math.floor(Date.now() / 1000);
    const overdue = danhSachCongViec.filter(t => !t.daHoanThanh && Number(t.hanChot) < now).length;
    // Convert wei to ETH for totalReward
    const totalReward = danhSachCongViec.reduce((sum, t) => {
      const rewardInEth = t.tienThuong && t.tienThuong !== '0'
        ? parseFloat(ethers.formatEther(t.tienThuong))
        : 0;
      return sum + rewardInEth;
    }, 0);
    return { total, completed, overdue, totalReward };
  }, [danhSachCongViec]);

  const handleSearch = (e) => {
    e.preventDefault();
    capNhatBoLoc({ tuKhoa: searchInput });
  };

  const sortOptions = [
    { value: 'moi-nhat', label: 'Mới Nhất' },
    { value: 'cu-nhat', label: 'Cũ Nhất' },
    { value: 'deadline', label: 'Hạn Chót' },
    { value: 'priority', label: 'Độ Ưu Tiên' },
  ];

  // Terminal stat card
  const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <div className="bg-surface-elevated border border-border rounded-xl p-4 hover:border-border-default transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-2xs text-muted uppercase tracking-widest mb-1">{label}</p>
          <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
          {sub && <p className="font-mono text-xs text-dim mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${color === 'text-neon-green' ? 'bg-neon-green/10' : color === 'text-neon-red' ? 'bg-neon-red/10' : color === 'text-neon-orange' ? 'bg-neon-orange/10' : 'bg-neon-cyan/10'}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-neon-green text-sm">$</span>
            <span className="font-mono text-secondary text-sm">taskmgr</span>
            <span className="font-mono text-dim text-sm">--danh_sach</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-primary tracking-tight">
            Danh Sách Công Việc<span className="text-neon-green animate-blink">_</span>
          </h2>
          <p className="font-mono text-sm text-secondary mt-1">
            {stats.total} nhiệm vụ • {stats.completed} hoàn thành
          </p>
        </div>

        {diaChiVi && (
          <Button
            onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}
            variant="primary"
            size="lg"
            icon={<FaPlus className="w-3.5 h-3.5" />}
          >
            TẠO CÔNG VIỆC
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      {
        diaChiVi && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FaTerminal} label="Tổng Số" value={stats.total} color="text-neon-cyan" />
            <StatCard icon={FaCheckCircle} label="Hoàn Thành" value={stats.completed} color="text-neon-green" sub={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : null} />
            <StatCard icon={FaExclamationTriangle} label="Quá Hạn" value={stats.overdue} color={stats.overdue > 0 ? "text-neon-red" : "text-dim"} />
            <StatCard icon={FaCoins} label="Phần Thưởng" value={stats.totalReward.toFixed(3)} color="text-neon-orange" sub="ETH" />
          </div>
        )
      }

      {/* Filters */}
      <div className="bg-surface-elevated border border-border rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-neon-green text-sm">$</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="tìm kiếm..."
                className="w-full pl-8 pr-4 py-2.5 bg-surface border border-border rounded-lg font-mono text-sm text-primary placeholder:text-dim focus:outline-none focus:border-neon-green transition-colors"
              />
            </div>
          </form>

          {/* Filter buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => capNhatBoLoc({ trangThai: TRANG_THAI.TAT_CA })}
              className={`px-4 py-2.5 rounded-lg font-mono text-xs font-medium transition-all ${boLoc.trangThai === TRANG_THAI.TAT_CA
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                : 'bg-surface-hover text-secondary border border-border hover:text-primary'
                }`}
            >
              TẤT CẢ
            </button>
            <button
              onClick={() => capNhatBoLoc({ trangThai: TRANG_THAI.CUA_TOI })}
              disabled={!diaChiVi}
              className={`px-4 py-2.5 rounded-lg font-mono text-xs font-medium transition-all disabled:opacity-50 ${boLoc.trangThai === TRANG_THAI.CUA_TOI
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                : 'bg-surface-hover text-secondary border border-border hover:text-primary'
                }`}
            >
              CỦA TÔI
            </button>

            {/* Priority Filter */}
            <Select
              options={[
                { value: 'all', label: 'Độ ưu tiên' },
                { value: '2', label: '🔴 Cao' },
                { value: '1', label: '🟡 Trung bình' },
                { value: '0', label: '🟢 Thấp' },
              ]}
              value={boLoc.doUuTien !== null && boLoc.doUuTien !== undefined ? String(boLoc.doUuTien) : 'all'}
              onChange={(val) => capNhatBoLoc({ doUuTien: val === 'all' ? null : parseInt(val) })}
              className="w-36"
            />

            {/* Category Filter */}
            <Select
              options={[
                { value: 'all', label: 'Danh mục' },
                { value: 'Development', label: 'Development' },
                { value: 'Design', label: 'Design' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Testing', label: 'Testing' },
                { value: 'Other', label: 'Other' },
              ]}
              value={boLoc.danhMuc ?? 'all'}
              onChange={(val) => capNhatBoLoc({ danhMuc: val === 'all' ? null : val })}
              className="w-36"
            />
          </div>

          {/* Sort - Custom Select */}
          <Select
            options={sortOptions}
            value={boLoc.sapXep}
            onChange={(val) => capNhatBoLoc({ sapXep: val })}
            className="w-40"
          />

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-surface-hover rounded-lg p-1 border border-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-border text-neon-green' : 'text-secondary hover:text-primary'}`}
            >
              <FaTh className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-border text-neon-green' : 'text-secondary hover:text-primary'}`}
            >
              <FaList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      {
        dangTai ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => <TaskCardSkeleton key={i} />)}
          </div>
        ) : danhSachCongViec.length === 0 ? (
          <div className="bg-surface-elevated border border-border border-dashed rounded-xl p-12 text-center">
            <div className="font-mono text-secondary mb-4">
              <span className="text-neon-green">$</span> ls ./tasks<br />
              <span className="text-dim">// không tìm thấy công việc nào</span>
            </div>
            <p className="font-display text-lg text-muted mb-4">
              {diaChiVi ? 'Trống. Hãy tạo công việc đầu tiên.' : 'Kết nối ví để bắt đầu.'}
            </p>
            {diaChiVi && (
              <Button onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }} variant="outline" icon={<FaPlus className="w-3 h-3" />}>
                TẠO CÔNG VIỆC
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {danhSachCongViec.map((task, idx) => (
              <TaskCard key={task.id} task={task} onEdit={(t) => { setTaskToEdit(t); setIsFormOpen(true); }} index={idx} />
            ))}
          </div>
        )
      }

      <TaskForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setTaskToEdit(null); }} taskToEdit={taskToEdit} />
    </div >
  );
};

export default TaskList;
