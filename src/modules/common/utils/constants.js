/**
 * @file constants.js
 * @description Các hằng số dùng chung trong ứng dụng
 */

// ============ BLOCKCHAIN CONFIG ============

/**
 * Địa chỉ Smart Contract (lấy từ .env sau khi deploy)
 */
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

/**
 * Chain ID của Sepolia Testnet
 * Decimal: 11155111
 * Hex: 0xaa36a7
 */
export const SEPOLIA_CHAIN_ID = '0xaa36a7';
export const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;

/**
 * RPC URL (dùng MetaMask mặc định nếu không có)
 */
export const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || 
  'https://sepolia.infura.io/v3/';

/**
 * Block Explorer URL
 */
export const ETHERSCAN_URL = 'https://sepolia.etherscan.io';

// ============ TRẠNG THÁI CÔNG VIỆC ============

export const TRANG_THAI = {
  TAT_CA: 'tat-ca',
  CUA_TOI: 'cua-toi',
  HOAN_THANH: 'hoan-thanh',
  DANG_LAM: 'dang-lam',
  DUOC_GAN: 'duoc-gan'
};

// ============ SẮP XẾP ============

export const SAP_XEP = {
  MOI_NHAT: 'moi-nhat',
  CU_NHAT: 'cu-nhat',
  DEADLINE: 'deadline',
  TIEN_THUONG: 'tien-thuong'
};

// ============ LOẠI THÔNG BÁO ============

export const LOAI_TOAST = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// ============ NETWORK INFO ============

export const NETWORK_INFO = {
  name: 'Sepolia Testnet',
  chainId: SEPOLIA_CHAIN_ID,
  chainIdDecimal: SEPOLIA_CHAIN_ID_DECIMAL,
  rpcUrl: SEPOLIA_RPC_URL,
  blockExplorer: ETHERSCAN_URL,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  }
};

// ============ GAS CONFIG ============

export const GAS_CONFIG = {
  GAS_LIMIT_MULTIPLIER: 1.2, // Thêm 20% buffer
  MAX_GAS_PRICE: '100', // Gwei
};

// ============ UI CONFIG ============

export const UI_CONFIG = {
  ITEMS_PER_PAGE: 10,
  TOAST_DURATION: 3000, // ms
  DEBOUNCE_DELAY: 500, // ms
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
};

// ============ ERROR MESSAGES ============

export const ERROR_MESSAGES = {
  NO_METAMASK: 'Vui lòng cài đặt MetaMask!',
  WRONG_NETWORK: 'Vui lòng chuyển sang Sepolia Testnet!',
  USER_REJECTED: 'Bạn đã từ chối giao dịch',
  INSUFFICIENT_FUNDS: 'Không đủ ETH để thực hiện giao dịch',
  CONTRACT_ERROR: 'Lỗi khi gọi Smart Contract',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  INVALID_ADDRESS: 'Địa chỉ ví không hợp lệ',
  INVALID_INPUT: 'Dữ liệu nhập không hợp lệ'
};

// ============ SUCCESS MESSAGES ============

export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Kết nối ví thành công!',
  TASK_CREATED: 'Tạo công việc thành công!',
  TASK_UPDATED: 'Cập nhật công việc thành công!',
  TASK_DELETED: 'Xóa công việc thành công!',
  TASK_COMPLETED: 'Đánh dấu hoàn thành!',
  TASK_ASSIGNED: 'Gán công việc thành công!',
  REWARD_ADDED: 'Thêm thưởng thành công!',
  REWARD_CLAIMED: 'Nhận thưởng thành công!'
};

// ============ LOADING MESSAGES ============

export const LOADING_MESSAGES = {
  CONNECTING: 'Đang kết nối ví...',
  LOADING_TASKS: 'Đang tải công việc...',
  CREATING_TASK: 'Đang tạo công việc...',
  UPDATING_TASK: 'Đang cập nhật...',
  DELETING_TASK: 'Đang xóa...',
  PROCESSING: 'Đang xử lý giao dịch...',
  WAITING_CONFIRMATION: 'Đang đợi xác nhận...'
};
