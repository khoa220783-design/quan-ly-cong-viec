/**
 * @file WalletContext.jsx
 * @description Context quản lý state ví MetaMask
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID, ERROR_MESSAGES } from '../common/utils/constants';
import toast from 'react-hot-toast';

// Tạo Context
const WalletContext = createContext();

/**
 * Hook để sử dụng WalletContext
 */
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext phải được sử dụng trong WalletProvider');
  }
  return context;
};

/**
 * WalletProvider Component
 */
export const WalletProvider = ({ children }) => {
  
  // State
  const [diaChiVi, setDiaChiVi] = useState(null);
  const [soDu, setSoDu] = useState('0');
  const [dangKetNoi, setDangKetNoi] = useState(false);
  const [network, setNetwork] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
  /**
   * Kiểm tra MetaMask đã cài chưa
   */
  const kiemTraMetaMask = () => {
    if (!window.ethereum) {
      toast.error(ERROR_MESSAGES.NO_METAMASK);
      return false;
    }
    return true;
  };
  
  /**
   * Lấy số dư ETH
   */
  const laySoDu = async (address, providerInstance) => {
    try {
      const balance = await providerInstance.getBalance(address);
      setSoDu(balance.toString());
    } catch (error) {
      console.error('Lỗi khi lấy số dư:', error);
    }
  };
  
  /**
   * Kiểm tra và chuyển network
   */
  const kiemTraNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== SEPOLIA_CHAIN_ID) {
        // Yêu cầu chuyển sang Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          return true;
        } catch (switchError) {
          // Network chưa được thêm, thêm mới
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: 'Sepolia Testnet',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }],
              });
              return true;
            } catch (addError) {
              console.error('Lỗi khi thêm network:', addError);
              toast.error('Không thể thêm Sepolia network');
              return false;
            }
          }
          toast.error(ERROR_MESSAGES.WRONG_NETWORK);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Lỗi khi kiểm tra network:', error);
      return false;
    }
  };
  
  /**
   * Kết nối ví
   */
  const ketNoiVi = async () => {
    if (!kiemTraMetaMask()) return;
    
    try {
      setDangKetNoi(true);
      
      // Kiểm tra network
      const networkOk = await kiemTraNetwork();
      if (!networkOk) {
        setDangKetNoi(false);
        return;
      }
      
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        toast.error('Không tìm thấy tài khoản');
        setDangKetNoi(false);
        return;
      }
      
      const address = accounts[0];
      
      // Tạo provider và signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const networkInfo = await web3Provider.getNetwork();
      
      setDiaChiVi(address);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setNetwork(networkInfo);
      
      // Lấy số dư
      await laySoDu(address, web3Provider);
      
      // Lưu vào localStorage
      localStorage.setItem('walletConnected', 'true');
      
      toast.success('Kết nối ví thành công!');
      
    } catch (error) {
      console.error('Lỗi khi kết nối ví:', error);
      
      if (error.code === 4001) {
        toast.error('Bạn đã từ chối kết nối');
      } else {
        toast.error('Lỗi khi kết nối ví');
      }
    } finally {
      setDangKetNoi(false);
    }
  };
  
  /**
   * Ngắt kết nối ví
   */
  const ngatKetNoiVi = () => {
    setDiaChiVi(null);
    setSoDu('0');
    setProvider(null);
    setSigner(null);
    setNetwork(null);
    localStorage.removeItem('walletConnected');
    toast.success('Đã ngắt kết nối ví');
  };
  
  /**
   * Tự động kết nối lại nếu đã kết nối trước đó
   */
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true' && window.ethereum) {
      ketNoiVi();
    }
  }, []);
  
  /**
   * Lắng nghe sự kiện thay đổi account
   */
  useEffect(() => {
    if (!window.ethereum) return;
    
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        ngatKetNoiVi();
      } else if (accounts[0] !== diaChiVi) {
        // Account đã thay đổi, kết nối lại
        ketNoiVi();
      }
    };
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [diaChiVi]);
  
  /**
   * Lắng nghe sự kiện thay đổi network
   */
  useEffect(() => {
    if (!window.ethereum) return;
    
    const handleChainChanged = () => {
      // Reload trang khi network thay đổi
      window.location.reload();
    };
    
    window.ethereum.on('chainChanged', handleChainChanged);
    
    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);
  
  /**
   * Cập nhật số dư định kỳ
   */
  useEffect(() => {
    if (!diaChiVi || !provider) return;
    
    // Cập nhật số dư mỗi 10 giây
    const interval = setInterval(() => {
      laySoDu(diaChiVi, provider);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [diaChiVi, provider]);
  
  // Context value
  const value = {
    diaChiVi,
    soDu,
    dangKetNoi,
    network,
    provider,
    signer,
    ketNoiVi,
    ngatKetNoiVi,
    kiemTraNetwork
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
