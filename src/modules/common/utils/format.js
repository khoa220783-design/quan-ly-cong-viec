/**
 * @file format.js
 * @description Các hàm format dữ liệu hiển thị
 */

import { ethers } from 'ethers';

/**
 * Format địa chỉ Ethereum
 * @param {string} address - Địa chỉ đầy đủ
 * @param {number} startChars - Số ký tự đầu (mặc định 6)
 * @param {number} endChars - Số ký tự cuối (mặc định 4)
 * @returns {string} - Địa chỉ đã format (vd: 0x1234...5678)
 */
export const formatDiaChi = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format số dư ETH
 * @param {string|BigInt} balance - Số dư trong wei
 * @param {number} decimals - Số chữ số thập phân (mặc định 4)
 * @returns {string} - Số dư đã format (vd: 1.2345 ETH)
 */
export const formatSoDu = (balance, decimals = 4) => {
  if (!balance) return '0 ETH';
  
  try {
    const formatted = ethers.formatEther(balance);
    const number = parseFloat(formatted);
    return `${number.toFixed(decimals)} ETH`;
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0 ETH';
  }
};

/**
 * Format số dư ETH (chỉ số, không có đơn vị)
 * @param {string|BigInt} balance - Số dư trong wei
 * @param {number} decimals - Số chữ số thập phân
 * @returns {string} - Số đã format
 */
export const formatSoDuSo = (balance, decimals = 4) => {
  if (!balance) return '0';
  
  try {
    const formatted = ethers.formatEther(balance);
    const number = parseFloat(formatted);
    return number.toFixed(decimals);
  } catch (error) {
    return '0';
  }
};

/**
 * Format ngày tháng
 * @param {number} timestamp - Unix timestamp (giây)
 * @returns {string} - Ngày đã format (vd: 25/12/2024)
 */
export const formatNgay = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(Number(timestamp) * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format ngày giờ đầy đủ
 * @param {number} timestamp - Unix timestamp (giây)
 * @returns {string} - Ngày giờ đã format (vd: 25/12/2024 14:30)
 */
export const formatNgayGio = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(Number(timestamp) * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Format thời gian còn lại
 * @param {number} deadline - Unix timestamp deadline
 * @returns {string} - Thời gian còn lại (vd: "2 ngày", "3 giờ", "Đã quá hạn")
 */
export const formatThoiGianConLai = (deadline) => {
  if (!deadline) return '';
  
  const now = Math.floor(Date.now() / 1000);
  const deadlineSeconds = Number(deadline);
  const diff = deadlineSeconds - now;
  
  if (diff < 0) {
    return 'Đã quá hạn';
  }
  
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  
  if (days > 0) {
    return `${days} ngày`;
  } else if (hours > 0) {
    return `${hours} giờ`;
  } else if (minutes > 0) {
    return `${minutes} phút`;
  } else {
    return 'Sắp hết hạn';
  }
};

/**
 * Format số lượng
 * @param {number} number - Số cần format
 * @returns {string} - Số đã format với dấu phẩy (vd: 1,234)
 */
export const formatSoLuong = (number) => {
  if (!number && number !== 0) return '0';
  return number.toLocaleString('vi-VN');
};

/**
 * Format phần trăm
 * @param {number} value - Giá trị
 * @param {number} total - Tổng
 * @param {number} decimals - Số chữ số thập phân
 * @returns {string} - Phần trăm đã format (vd: 75.5%)
 */
export const formatPhanTram = (value, total, decimals = 1) => {
  if (!total || total === 0) return '0%';
  const percent = (value / total) * 100;
  return `${percent.toFixed(decimals)}%`;
};

/**
 * Format transaction hash
 * @param {string} hash - Transaction hash
 * @returns {string} - Hash đã format
 */
export const formatTxHash = (hash) => {
  return formatDiaChi(hash, 10, 8);
};

/**
 * Tạo link Etherscan cho transaction
 * @param {string} hash - Transaction hash
 * @returns {string} - URL đầy đủ
 */
export const getTxLink = (hash) => {
  return `https://sepolia.etherscan.io/tx/${hash}`;
};

/**
 * Tạo link Etherscan cho address
 * @param {string} address - Địa chỉ ví
 * @returns {string} - URL đầy đủ
 */
export const getAddressLink = (address) => {
  return `https://sepolia.etherscan.io/address/${address}`;
};

/**
 * Format input date cho HTML input type="datetime-local"
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Format YYYY-MM-DDTHH:mm
 */
export const formatDateTimeLocal = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(Number(timestamp) * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Parse datetime-local input thành Unix timestamp
 * @param {string} dateTimeString - String từ input datetime-local
 * @returns {number} - Unix timestamp (giây)
 */
export const parseDateTimeLocal = (dateTimeString) => {
  if (!dateTimeString) return 0;
  
  const date = new Date(dateTimeString);
  return Math.floor(date.getTime() / 1000);
};
