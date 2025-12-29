/**
 * @file ContractContext.jsx
 * @description Context quản lý Smart Contract instance - Super Optimized Version
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletContext } from '../wallet/WalletContext';
import { CONTRACT_ADDRESS } from '../common/utils/constants';
import TaskManagerABI from './abi/TaskManager.json';
import toast from 'react-hot-toast';

const ContractContext = createContext();

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContractContext phải được sử dụng trong ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const { signer, diaChiVi } = useWalletContext();
  const [contract, setContract] = useState(null);
  const [contractReadOnly, setContractReadOnly] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (!CONTRACT_ADDRESS) {
        console.warn('Contract chưa được khởi tạo');
        return;
      }
      try {
        if (signer) {
          setContract(new ethers.Contract(CONTRACT_ADDRESS, TaskManagerABI, signer));
        }
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setContractReadOnly(new ethers.Contract(CONTRACT_ADDRESS, TaskManagerABI, provider));
        }
      } catch (error) {
        console.error('Lỗi khởi tạo contract:', error);
      }
    };
    initContract();
  }, [signer]);

  // WRAPPER FUNCTIONS
  const taoCongViec = async (tieuDe, moTa, danhMuc, doUuTien, hanChot) => {
    if (!contract) {
      toast.error('Vui lòng kết nối ví trước!');
      return null;
    }
    try {
      toast.loading('Đang tạo công việc...', { id: 'create-task' });
      const tx = await contract.taoCongViec(tieuDe, moTa, danhMuc, doUuTien, hanChot);
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

  const suaCongViec = async (id, tieuDe, moTa, danhMuc, doUuTien, hanChot) => {
    if (!contract) {
      toast.error('Vui lòng kết nối ví trước!');
      return false;
    }
    try {
      toast.loading('Đang cập nhật...', { id: 'update-task' });
      const tx = await contract.suaCongViec(id, tieuDe, moTa, danhMuc, doUuTien, hanChot);
      await tx.wait();
      toast.success('Cập nhật thành công!', { id: 'update-task' });
      return true;
    } catch (error) {
      console.error('Lỗi khi sửa:', error);
      toast.error('Lỗi khi cập nhật', { id: 'update-task' });
      return false;
    }
  };

  const xoaCongViec = async (id) => {
    if (!contract) return false;
    try {
      toast.loading('Đang xóa...', { id: 'delete-task' });
      const tx = await contract.xoaCongViec(id);
      await tx.wait();
      toast.success('Đã xóa!', { id: 'delete-task' });
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa', { id: 'delete-task' });
      return false;
    }
  };

  const danhDauHoanThanh = async (id, status) => {
    if (!contract) return false;
    try {
      toast.loading('Đang cập nhật...', { id: 'toggle-task' });
      const tx = await contract.danhDauHoanThanh(id, status);
      await tx.wait();
      toast.success(status ? 'Đã hoàn thành!' : 'Đã cập nhật', { id: 'toggle-task' });
      return true;
    } catch (error) {
      console.error('Lỗi khi đánh dấu:', error);
      toast.error('Lỗi', { id: 'toggle-task' });
      return false;
    }
  };

  const ganCongViec = async (id, to) => {
    if (!contract) return;
    try {
      toast.loading('Đang gán...', { id: 'assign-task' });
      const tx = await contract.ganCongViec(id, to);
      await tx.wait();
      toast.success('Đã gán!', { id: 'assign-task' });
    } catch (error) {
      console.error('Lỗi khi gán:', error);
      toast.error('Lỗi', { id: 'assign-task' });
    }
  };

  const themThuong = async (id, value) => {
    if (!contract) return;
    try {
      toast.loading('Đang thêm thưởng...', { id: 'add-reward' });
      const tx = await contract.themThuong(id, { value });
      await tx.wait();
      toast.success('Đã thêm thưởng!', { id: 'add-reward' });
    } catch (error) {
      console.error('Lỗi khi thêm thưởng:', error);
      toast.error('Lỗi', { id: 'add-reward' });
    }
  };

  const nhanThuong = async (id) => {
    if (!contract) return;
    try {
      toast.loading('Đang nhận thưởng...', { id: 'claim-reward' });
      const tx = await contract.nhanThuong(id);
      await tx.wait();
      toast.success('Đã nhận thưởng!', { id: 'claim-reward' });
    } catch (error) {
      console.error('Lỗi khi nhận thưởng:', error);
      toast.error('Lỗi', { id: 'claim-reward' });
    }
  };

  /**
   * Lấy tất cả công việc từ Events
   */
  const layTatCaCongViec = useCallback(async () => {
    const c = contract || contractReadOnly;
    if (!c) {
      console.warn('Contract chưa được khởi tạo');
      return [];
    }

    try {
      const currentAddr = await c.getAddress();
      const provider = c.runner.provider || c.provider;
      const network = await provider.getNetwork();

      console.log('=== DEBUG INFO ===');
      console.log('Contract Address:', currentAddr);
      console.log('Chain ID:', network.chainId.toString());
      console.log('Network Name:', network.name);

      // Kiểm tra xem có đúng Sepolia không
      if (network.chainId.toString() !== '11155111') {
        console.error('⚠️ CẢNH BÁO: Bạn đang ở chain ID', network.chainId.toString(), 'thay vì Sepolia (11155111)');
      }

      console.log('Đang query events...');

      // Thử query với nhiều cách khác nhau
      let createdEvents = [];

      // Cách 1: Query từ gần đây nhất
      try {
        console.log('Thử query 10000 block gần nhất...');
        createdEvents = await c.queryFilter(c.filters.TaskCreated(), -10000);
        console.log(`→ Tìm thấy ${createdEvents.length} events`);
      } catch (e1) {
        console.warn('Lỗi query -10000:', e1.message);

        // Cách 2: Query không giới hạn
        try {
          console.log('Thử query tất cả blocks...');
          createdEvents = await c.queryFilter(c.filters.TaskCreated());
          console.log(`→ Tìm thấy ${createdEvents.length} events`);
        } catch (e2) {
          console.error('Lỗi query tất cả:', e2.message);

          // Cách 3: Đợi 3 giây rồi thử lại (RPC có thể bị lag)
          console.log('Đợi 3 giây rồi thử lại...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          createdEvents = await c.queryFilter(c.filters.TaskCreated());
          console.log(`→ Tìm thấy ${createdEvents.length} events sau khi đợi`);
        }
      }

      if (createdEvents.length === 0) {
        console.warn('⚠️ Không tìm thấy sự kiện nào. Có thể:');
        console.warn('  1. RPC đang lag - hãy đợi vài phút rồi refresh');
        console.warn('  2. Contract address sai');
        console.warn('  3. Đang ở sai network');
        return [];
      }

      // Lấy events khác
      const deletedEvents = await c.queryFilter(c.filters.TaskDeleted(), -10000);
      const deletedIds = new Set(deletedEvents.map(e => e.args.id.toString()));

      const updatedEvents = await c.queryFilter(c.filters.TaskUpdated(), -10000);
      const latestUpdates = {};
      updatedEvents.forEach(e => {
        const id = e.args.id.toString();
        if (!latestUpdates[id] || e.blockNumber > latestUpdates[id].blockNumber) {
          latestUpdates[id] = e;
        }
      });

      // Build tasks
      const tasks = await Promise.all(
        createdEvents
          .filter(e => !deletedIds.has(e.args.id.toString()))
          .map(async (e) => {
            const id = e.args.id;
            const idStr = id.toString();

            try {

              const res = await c.getTaskInfo(id);
              const update = latestUpdates[idStr];

              // Safely get title and desc from contract or events
              const title = res[2] || (update ? update.args.title : e.args.title);
              const desc = res[3] || (update ? update.args.desc : e.args.desc);

              // Safely get category and priority - handle both old and new events
              const category = res[4] || (update?.args?.category) || (e.args?.category) || '';
              const priority = res[5] !== undefined ? res[5] : (update?.args?.priority ?? e.args?.priority ?? 0);

              return {
                id: id,
                owner: (res[0] || e.args.owner || '').toString(),
                tieuDe: title,
                moTa: desc,
                danhMuc: category,
                doUuTien: priority,
                hanChot: res[6], // deadline is now index 6
                daHoanThanh: res[8], // completed is now index 8
                tienThuong: res[7] || 0n, // reward is now index 7
                nguoiDuocGan: (res[1] || '0x0000000000000000000000000000000000000000').toString(),
                thoiGianTao: 0n,
                daNhanThuong: res[9] || false // rewardClaimed is now index 9
              };
            } catch (err) {
              console.error(`Lỗi parse task ${idStr}:`, err);
              return null;
            }
          })
      );

      const filteredTasks = tasks.filter(t => t !== null);
      console.log(`✅ Tìm thấy ${filteredTasks.length} task hợp lệ`);
      return filteredTasks;
    } catch (error) {
      console.error('❌ Lỗi nghiêm trọng:', error);
      return [];
    }
  }, [contract, contractReadOnly]);

  /**
   * Lấy công việc của một địa chỉ cụ thể
   */
  const layCongViecCuaToi = useCallback(async (address) => {
    if (!address) return [];
    const allTasks = await layTatCaCongViec();

    return allTasks.filter(task => {
      const owner = (task.owner || '').toLowerCase();
      const search = address.toLowerCase();
      return owner === search;
    });
  }, [layTatCaCongViec]);

  /**
   * Lấy chi tiết một công việc
   */
  const layChiTietCongViec = useCallback(async (id) => {
    const allTasks = await layTatCaCongViec();
    return allTasks.find(task => task.id.toString() === id.toString()) || null;
  }, [layTatCaCongViec]);

  return (
    <ContractContext.Provider value={{
      contract,
      contractReadOnly,
      taoCongViec,
      suaCongViec,
      xoaCongViec,
      danhDauHoanThanh,
      ganCongViec,
      themThuong,
      nhanThuong,
      layTatCaCongViec,
      layCongViecCuaToi,
      layChiTietCongViec
    }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;
