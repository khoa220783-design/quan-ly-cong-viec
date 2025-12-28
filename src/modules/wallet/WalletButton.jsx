/**
 * @file WalletButton.jsx
 * @description Wallet Button với light/dark support
 */

import React, { useState, useRef, useEffect } from 'react';
import { useWalletContext } from './WalletContext';
import { formatDiaChi, formatSoDu } from '../common/utils/format';
import Button from '../common/components/Button';
import { FaWallet, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';

const WalletButton = () => {
  const { diaChiVi, soDu, dangKetNoi, ketNoiVi, ngatKetNoiVi } = useWalletContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(diaChiVi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openEtherscan = () => {
    window.open(`https://sepolia.etherscan.io/address/${diaChiVi}`, '_blank');
  };

  if (!diaChiVi) {
    return (
      <Button
        onClick={ketNoiVi}
        loading={dangKetNoi}
        variant="primary"
        size="sm"
        icon={<FaWallet className="w-4 h-4" />}
      >
        {dangKetNoi ? 'Đang kết nối...' : 'Kết nối ví'}
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`
          flex items-center gap-2 px-3 py-2
          bg-white dark:bg-zinc-800
          border rounded-xl
          transition-all duration-200
          ${isDropdownOpen
            ? 'border-violet-300 dark:border-violet-500/50'
            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
          }
        `}
      >
        {/* Balance */}
        <span className="hidden sm:block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {formatSoDu(soDu)}
        </span>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-zinc-200 dark:bg-zinc-700" />

        {/* Avatar & Address */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {diaChiVi.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {formatDiaChi(diaChiVi)}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="
          absolute right-0 mt-2 w-64
          bg-white dark:bg-zinc-800
          rounded-xl shadow-lg
          border border-zinc-200 dark:border-zinc-700
          animate-slide-down
          overflow-hidden
          z-50
        ">
          {/* Header */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {diaChiVi.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-white">
                  {formatDiaChi(diaChiVi)}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Sepolia Testnet
                </p>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-700">
            <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Số dư</p>
              <p className="text-lg font-bold text-zinc-800 dark:text-white">
                {formatSoDu(soDu)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={copyAddress}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              {copied ? <FaCheck className="w-4 h-4 text-emerald-500" /> : <FaCopy className="w-4 h-4" />}
              <span className="text-sm">{copied ? 'Đã sao chép!' : 'Sao chép địa chỉ'}</span>
            </button>

            <button
              onClick={openEtherscan}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
              <span className="text-sm">Xem trên Etherscan</span>
            </button>

            <div className="h-px bg-zinc-100 dark:bg-zinc-700 my-1" />

            <button
              onClick={() => {
                ngatKetNoiVi();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="text-sm">Ngắt kết nối</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
