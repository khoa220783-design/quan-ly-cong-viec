/**
 * @file WalletButton.jsx
 * @description Premium Wallet Button với dropdown và animations
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Copy address to clipboard
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(diaChiVi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Open Etherscan
  const openEtherscan = () => {
    window.open(`https://sepolia.etherscan.io/address/${diaChiVi}`, '_blank');
  };

  // Not connected state
  if (!diaChiVi) {
    return (
      <Button
        onClick={ketNoiVi}
        loading={dangKetNoi}
        variant="gradient"
        icon={<FaWallet className="w-4 h-4" />}
      >
        {dangKetNoi ? 'Đang kết nối...' : 'Kết nối ví'}
      </Button>
    );
  }

  // Connected state with dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`
          flex items-center gap-3 px-4 py-2
          glass rounded-xl
          border border-white/10 hover:border-brand-500/30
          transition-all duration-200
          ${isDropdownOpen ? 'border-brand-500/50' : ''}
        `}
      >
        {/* Balance */}
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-white">
            {formatSoDu(soDu)}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {diaChiVi.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-dark-200">
            {formatDiaChi(diaChiVi)}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-dark-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="
          absolute right-0 mt-2 w-72
          glass rounded-xl
          border border-white/10
          shadow-2xl shadow-black/50
          animate-slide-down
          overflow-hidden
          z-50
        ">
          {/* Header */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {diaChiVi.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {formatDiaChi(diaChiVi)}
                </p>
                <p className="text-xs text-dark-400">
                  Sepolia Testnet
                </p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="p-4 border-b border-white/5">
            <div className="glass rounded-lg p-3 border border-white/5">
              <p className="text-xs text-dark-400 mb-1">Số dư</p>
              <p className="text-xl font-bold gradient-text">
                {formatSoDu(soDu)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={copyAddress}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {copied ? (
                <FaCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <FaCopy className="w-4 h-4" />
              )}
              <span className="text-sm">
                {copied ? 'Đã sao chép!' : 'Sao chép địa chỉ'}
              </span>
            </button>

            <button
              onClick={openEtherscan}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
              <span className="text-sm">Xem trên Etherscan</span>
            </button>

            <div className="h-px bg-white/5 my-2" />

            <button
              onClick={() => {
                ngatKetNoiVi();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
