/**
 * @file WalletButton.jsx
 * @description Terminal-style Wallet Button
 */

import React, { useState, useRef, useEffect } from 'react';
import { useWalletContext } from './WalletContext';
import { formatDiaChi, formatSoDu } from '../common/utils/format';
import Button from '../common/components/Button';
import { FaWallet, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';

const WalletButton = () => {
  const { diaChiVi, soDu, dangKetNoi, ketNoiVi, ngatKetNoiVi } = useWalletContext();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(diaChiVi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!diaChiVi) {
    return (
      <Button onClick={ketNoiVi} loading={dangKetNoi} variant="primary" size="md" icon={<FaWallet className="w-3.5 h-3.5" />}>
        CONNECT
      </Button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-3 py-2
          bg-surface-elevated border rounded-lg
          font-mono text-sm
          transition-all duration-200
          ${isOpen ? 'border-neon-green' : 'border-border hover:border-border-strong'}
        `}
      >
        {/* Balance */}
        <span className="hidden sm:block text-neon-green font-semibold">
          {formatSoDu(soDu)}
        </span>
        <div className="hidden sm:block w-px h-4 bg-border" />

        {/* Address */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/30 flex items-center justify-center">
            <span className="text-2xs font-bold text-neon-green">
              {diaChiVi.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <span className="text-secondary">{formatDiaChi(diaChiVi)}</span>
        </div>

        <svg className={`w-3 h-3 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-surface-elevated border border-border rounded-xl shadow-2xl shadow-black/50 animate-slide-down overflow-hidden z-50">
          {/* Header */}
          <div className="p-3 border-b border-border bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/30 flex items-center justify-center">
                <span className="text-sm font-bold text-neon-green">{diaChiVi.slice(2, 4).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-mono text-xs text-primary">{formatDiaChi(diaChiVi)}</p>
                <p className="font-mono text-2xs text-muted uppercase">SEPOLIA TESTNET</p>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="p-3 border-b border-border">
            <div className="bg-surface rounded-lg p-3 border border-border">
              <p className="font-mono text-2xs text-muted uppercase mb-1">Balance</p>
              <p className="font-mono text-2xs text-muted uppercase mb-1">Số dư</p>
              <p className="font-display text-xl font-bold text-neon-green">{formatSoDu(soDu)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button onClick={copyAddress} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs text-secondary hover:text-primary hover:bg-surface-hover transition-colors">
              {copied ? <FaCheck className="w-3.5 h-3.5 text-neon-green" /> : <FaCopy className="w-3.5 h-3.5" />}
              {copied ? 'ĐÃ SAO CHÉP!' : 'SAO CHÉP ĐỊA CHỈ'}
            </button>
            <button onClick={() => window.open(`https://sepolia.etherscan.io/address/${diaChiVi}`, '_blank')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs text-secondary hover:text-primary hover:bg-surface-hover transition-colors">
              <FaExternalLinkAlt className="w-3.5 h-3.5" />
              XEM TRÊN ETHERSCAN
            </button>
            <div className="h-px bg-border my-1" />
            <button onClick={() => { ngatKetNoiVi(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs text-neon-red hover:bg-neon-red/10 transition-colors">
              <FaSignOutAlt className="w-3.5 h-3.5" />
              DISCONNECT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
