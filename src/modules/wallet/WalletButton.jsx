/**
 * @file WalletButton.jsx
 * @description Component nút kết nối/ngắt kết nối ví
 */

import React from 'react';
import { useWalletContext } from './WalletContext';
import { formatDiaChi, formatSoDu } from '../common/utils/format';
import Button from '../common/components/Button';

const WalletButton = () => {
  const { diaChiVi, soDu, dangKetNoi, ketNoiVi, ngatKetNoiVi } = useWalletContext();
  
  // Nếu chưa kết nối
  if (!diaChiVi) {
    return (
      <Button
        onClick={ketNoiVi}
        loading={dangKetNoi}
        variant="primary"
      >
        {dangKetNoi ? 'Đang kết nối...' : 'Kết nối ví'}
      </Button>
    );
  }
  
  // Đã kết nối - hiển thị thông tin
  return (
    <div className="flex items-center gap-3">
      {/* Số dư */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <svg 
          className="w-5 h-5 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="font-medium text-gray-700">
          {formatSoDu(soDu)}
        </span>
      </div>
      
      {/* Địa chỉ ví */}
      <button
        onClick={ngatKetNoiVi}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="font-medium">
          {formatDiaChi(diaChiVi)}
        </span>
      </button>
    </div>
  );
};

export default WalletButton;
