/**
 * @file TaskContext.jsx
 * @description Context quản lý state tasks
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useContractContext } from '../contract/ContractContext';
import { useWalletContext } from '../wallet/WalletContext';
import { TRANG_THAI } from '../common/utils/constants';

// Tạo Context
const TaskContext = createContext();

/**
 * Hook để sử dụng TaskContext
 */
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext phải được sử dụng trong TaskProvider');
  }
  return context;
};

/**
 * TaskProvider Component
 */
export const TaskProvider = ({ children }) => {
  
  const { layTatCaCongViec, layCongViecCuaToi } = useContractContext();
  const { diaChiVi } = useWalletContext();
  
  const [danhSachCongViec, setDanhSachCongViec] = useState([]);
  const [congViecDangChon, setCongViecDangChon] = useState(null);
  const [dangTai, setDangTai] = useState(false);
  const [boLoc, setBoLoc] = useState({
    trangThai: TRANG_THAI.TAT_CA,
    sapXep: 'moi-nhat',
    tuKhoa: ''
  });
  
  /**
   * Tải danh sách công việc
   */
  const taiDanhSach = async () => {
    setDangTai(true);
    
    try {
      let tasks = [];
      
      if (boLoc.trangThai === TRANG_THAI.CUA_TOI && diaChiVi) {
        tasks = await layCongViecCuaToi(diaChiVi);
      } else {
        tasks = await layTatCaCongViec();
      }
      
      // Convert BigInt to string for JSON serialization
      const formattedTasks = tasks.map(task => ({
        id: task.id.toString(),
        owner: task.owner,
        tieuDe: task.tieuDe,
        moTa: task.moTa,
        hanChot: task.hanChot.toString(),
        daHoanThanh: task.daHoanThanh,
        tienThuong: task.tienThuong.toString(),
        nguoiDuocGan: task.nguoiDuocGan,
        thoiGianTao: task.thoiGianTao.toString(),
        daNhanThuong: task.daNhanThuong
      }));
      
      setDanhSachCongViec(formattedTasks);
    } catch (error) {
      console.error('Lỗi khi tải danh sách:', error);
    } finally {
      setDangTai(false);
    }
  };
  
  /**
   * Lọc danh sách công việc
   */
  const locDanhSach = () => {
    let filtered = [...danhSachCongViec];
    
    // Lọc theo trạng thái
    if (boLoc.trangThai === TRANG_THAI.HOAN_THANH) {
      filtered = filtered.filter(task => task.daHoanThanh);
    } else if (boLoc.trangThai === TRANG_THAI.DANG_LAM) {
      filtered = filtered.filter(task => !task.daHoanThanh);
    } else if (boLoc.trangThai === TRANG_THAI.CUA_TOI && diaChiVi) {
      filtered = filtered.filter(task => 
        task.owner.toLowerCase() === diaChiVi.toLowerCase()
      );
    }
    
    // Tìm kiếm theo từ khóa
    if (boLoc.tuKhoa) {
      const keyword = boLoc.tuKhoa.toLowerCase();
      filtered = filtered.filter(task =>
        task.tieuDe.toLowerCase().includes(keyword) ||
        task.moTa.toLowerCase().includes(keyword)
      );
    }
    
    // Sắp xếp
    if (boLoc.sapXep === 'moi-nhat') {
      filtered.sort((a, b) => Number(b.thoiGianTao) - Number(a.thoiGianTao));
    } else if (boLoc.sapXep === 'cu-nhat') {
      filtered.sort((a, b) => Number(a.thoiGianTao) - Number(b.thoiGianTao));
    } else if (boLoc.sapXep === 'deadline') {
      filtered.sort((a, b) => Number(a.hanChot) - Number(b.hanChot));
    }
    
    return filtered;
  };
  
  /**
   * Cập nhật bộ lọc
   */
  const capNhatBoLoc = (newFilter) => {
    setBoLoc(prev => ({ ...prev, ...newFilter }));
  };
  
  /**
   * Tải lại danh sách khi bộ lọc thay đổi
   */
  useEffect(() => {
    if (boLoc.trangThai === TRANG_THAI.CUA_TOI && !diaChiVi) {
      // Chưa kết nối ví, không tải
      return;
    }
    
    taiDanhSach();
  }, [boLoc.trangThai, diaChiVi]);
  
  // Context value
  const value = {
    danhSachCongViec: locDanhSach(),
    congViecDangChon,
    dangTai,
    boLoc,
    setCongViecDangChon,
    capNhatBoLoc,
    taiDanhSach
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
