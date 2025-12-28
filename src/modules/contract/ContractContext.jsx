/**
 * @file ContractContext.jsx
 * @description Context quản lý Smart Contract instance
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletContext } from '../wallet/WalletContext';
import { CONTRACT_ADDRESS } from '../common/utils/constants';
import TaskManagerABI from './abi/TaskManager.json';
import toast from 'react-hot-toast';

// Tạo Context
const ContractContext = createContext();

/**
 * Hook để sử dụng ContractContext
 */
export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContractContext phải được sử dụng trong ContractProvider');
  }
  return context;
};

/**
 * ContractProvider Component
 */
export const ContractProvider = ({ children }) => {
  
  const { signer, diaChiVi } = useWalletContext();
  const [contract, setContract] = useState(null);
  const [contractReadOnly, setContractReadOnly] = useState(null);
  
  /**
   * Khởi tạo contract instance
   */
  useEffect(() => {
    const initContract = async () => {
      try {
        // Kiểm tra địa chỉ contract
        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '') {
          console.warn('Chưa cấu hình địa chỉ contract trong .env');
          return;
        }
        
        // Contract với signer (có thể ghi)
        if (signer) {
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            TaskManagerABI,
            signer
          );
          setContract(contractInstance);
        }
        
        // Contract read-only (chỉ đọc, không cần wallet)
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const readOnlyContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            TaskManagerABI,
            provider
          );
          setContractReadOnly(readOnlyContract);
        }
        
      } catch (error) {
        console.error('Lỗi khi khởi tạo contract:', error);
      }
    };
    
    initContract();
  }, [signer]);
  
  /**
   * Tạo công việc mới
   */
  const taoCongViec = async (tieuDe, moTa, hanChot) => {
    if (!contract) {
      toast.error('Vui lòng kết nối ví trước!');
      return null;
    }
    
    try {
      toast.loading('Đang tạo công việc...', { id: 'create-task' });
      
      const tx = await contract.taoCongViec(tieuDe, moTa, hanChot);
      
      toast.loading('Đang đợi xác nhận...', { id: 'create-task' });
      const receipt = await tx.wait();
      
      toast.success('Tạo công việc thành công!', { id: 'create-task' });
      
      return receipt;
    } catch (error) {
      console.error('Lỗi khi tạo công việc:', error);
      
      if (error.code === 4001) {
        toast.error('Bạn đã từ chối giao dịch', { id: 'create-task' });
      } else {
        toast.error('Lỗi khi tạo công việc', { id: 'create-task' });
      }
      
      return null;
    }
  };
  
  /**
   * Sửa công việc
   */
  const suaCongViec = async (id, tieuDe, moTa, hanChot) => {
    if (!contract) {
      toast.error('Vui lòng kết nối ví trước!');
      return null;
    }
    
    try {
      toast.loading('Đang cập nhật...', { id: 'update-task' });
      
      const tx = await contract.suaCongViec(id, tieuDe, moTa, hanChot);
      
      toast.loading('Đang đợi xác nhận...', { id: 'update-task' });
      const receipt = await tx.wait();
      
      toast.success('Cập nhật thành công!', { id: 'update-task' });
      
      return receipt;
    } catch (error) {
      console.error('Lỗi khi sửa công việc:', error);
      
      if (error.code === 4001) {
        toast.error('Bạn đã từ chối giao dịch', { id: 'update-task' });
      } else {
        toast.error('Lỗi khi cập nhật', { id: 'update-task' });
      }
      
      return null;
    }
  };
  
  /**
   * Xóa công việc
   */
  const xoaCongViec = async (id) => {
    if (!contract) {
      toast.error('Vui lòng kết nối ví trước!');
      return null;
    }
    
    try {
      toast.loading('Đang xóa...', { id: 'delete-task' });
      
      const tx = await contract.xoaCongViec(id);
      
      toast.loading('Đang đợi xác nhận...', { id: 'delete-task' });
      const receipt = await tx.wait();
      
      toast.success('Xóa thành công!', { id: 'delete-task' });
      
      return receipt;
    } catch (error) {
      console.error('Lỗi khi xóa công việc:', error);
      
      if (error.code === 4001) {
        toast.error('Bạn đã từ chối giao dịch', { id: 'delete-task' });
      } else {
        toast.error('Lỗi khi xóa', { id: 'delete-task' });
      }
      
      return null;
    }
  };
  
  /**
   * Đánh dấu hoàn thành
   */
  const danhDauHoanThanh = async (id, trangThai) => {
    if (!contract) {
      toast.error('Vui lòng kết nối ví trước!');
      return null;
    }
    
    try {
      toast.loading('Đang cập nhật...', { id: 'toggle-task' });
      
      const tx = await contract.danhDauHoanThanh(id, trangThai);
      
      toast.loading('Đang đợi xác nhận...', { id: 'toggle-task' });
      const receipt = await tx.wait();
      
      toast.success(trangThai ? 'Đã hoàn thành!' : 'Đã đánh dấu chưa hoàn thành', { id: 'toggle-task' });
      
      return receipt;
    } catch (error) {
      console.error('Lỗi khi đánh dấu:', error);
      
      if (error.code === 4001) {
        toast.error('Bạn đã từ chối giao dịch', { id: 'toggle-task' });
      } else {
        toast.error('Lỗi khi cập nhật', { id: 'toggle-task' });
      }
      
      return null;
    }
  };
  
  /**
   * Lấy tất cả công việc
   */
  const layTatCaCongViec = async () => {
    const contractToUse = contract || contractReadOnly;
    
    if (!contractToUse) {
      console.warn('Contract chưa được khởi tạo');
      return [];
    }
    
    try {
      const tasks = await contractToUse.layTatCaCongViec();
      return tasks;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách:', error);
      return [];
    }
  };
  
  /**
   * Lấy công việc của tôi
   */
  const layCongViecCuaToi = async (address) => {
    const contractToUse = contract || contractReadOnly;
    
    if (!contractToUse) {
      return [];
    }
    
    try {
      const tasks = await contractToUse.layCongViecCuaToi(address || diaChiVi);
      return tasks;
    } catch (error) {
      console.error('Lỗi khi lấy công việc của tôi:', error);
      return [];
    }
  };
  
  /**
   * Lấy chi tiết công việc
   */
  const layChiTietCongViec = async (id) => {
    const contractToUse = contract || contractReadOnly;
    
    if (!contractToUse) {
      return null;
    }
    
    try {
      const task = await contractToUse.layChiTietCongViec(id);
      return task;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết:', error);
      return null;
    }
  };
  
  // Context value
  const value = {
    contract,
    contractReadOnly,
    taoCongViec,
    suaCongViec,
    xoaCongViec,
    danhDauHoanThanh,
    layTatCaCongViec,
    layCongViecCuaToi,
    layChiTietCongViec
  };
  
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;
