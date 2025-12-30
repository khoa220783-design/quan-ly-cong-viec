/**
 * @file validate.js
 * @description Các hàm validation dữ liệu
 */

import { ethers } from "ethers";
import { UI_CONFIG } from "./constants";

/**
 * Kiểm tra địa chỉ Ethereum có hợp lệ không
 * @param {string} address - Địa chỉ cần kiểm tra
 * @returns {boolean} - true nếu hợp lệ
 */
export const kiemTraDiaChi = (address) => {
  if (!address) return false;

  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Kiểm tra số tiền có hợp lệ không
 * @param {string} amount - Số tiền (ETH)
 * @returns {boolean} - true nếu hợp lệ
 */
export const kiemTraSoTien = (amount) => {
  if (!amount) return false;

  try {
    const num = parseFloat(amount);
    return num > 0 && !isNaN(num);
  } catch {
    return false;
  }
};

/**
 * Kiểm tra tiêu đề có hợp lệ không
 * @param {string} title - Tiêu đề
 * @returns {object} - { valid: boolean, message: string }
 */
export const kiemTraTieuDe = (title) => {
  if (!title || title.trim().length === 0) {
    return {
      valid: false,
      message: "Tiêu đề không được để trống",
    };
  }

  if (title.length > UI_CONFIG.MAX_TITLE_LENGTH) {
    return {
      valid: false,
      message: `Tiêu đề không được quá ${UI_CONFIG.MAX_TITLE_LENGTH} ký tự`,
    };
  }

  return {
    valid: true,
    message: "",
  };
};

/**
 * Kiểm tra mô tả có hợp lệ không
 * @param {string} description - Mô tả
 * @returns {object} - { valid: boolean, message: string }
 */
export const kiemTraMoTa = (description) => {
  if (!description || description.trim().length === 0) {
    return {
      valid: false,
      message: "Mô tả không được để trống",
    };
  }

  if (description.length > UI_CONFIG.MAX_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      message: `Mô tả không được quá ${UI_CONFIG.MAX_DESCRIPTION_LENGTH} ký tự`,
    };
  }

  return {
    valid: true,
    message: "",
  };
};

/**
 * Kiểm tra deadline có hợp lệ không
 * @param {number} deadline - Unix timestamp
 * @returns {object} - { valid: boolean, message: string }
 */
export const kiemTraHanChot = (deadline) => {
  if (!deadline) {
    return {
      valid: false,
      message: "Vui lòng chọn hạn chót",
    };
  }

  const now = Math.floor(Date.now() / 1000);

  if (deadline <= now) {
    return {
      valid: false,
      message: "Hạn chót phải lớn hơn thời gian hiện tại",
    };
  }

  return {
    valid: true,
    message: "",
  };
};

/**
 * Validate form tạo/sửa công việc
 * @param {object} data - { tieuDe, moTa, hanChot }
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateFormCongViec = (data) => {
  const errors = {};

  // Kiểm tra tiêu đề
  const tieuDeCheck = kiemTraTieuDe(data.tieuDe);
  if (!tieuDeCheck.valid) {
    errors.tieuDe = tieuDeCheck.message;
  }

  // Kiểm tra mô tả
  const moTaCheck = kiemTraMoTa(data.moTa);
  if (!moTaCheck.valid) {
    errors.moTa = moTaCheck.message;
  }

  // Kiểm tra hạn chót
  const hanChotCheck = kiemTraHanChot(data.hanChot);
  if (!hanChotCheck.valid) {
    errors.hanChot = hanChotCheck.message;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate số tiền thưởng
 * @param {string} amount - Số tiền ETH
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateTienThuong = (amount) => {
  if (!amount || amount.trim() === "") {
    return {
      valid: false,
      message: "Vui lòng nhập số tiền",
    };
  }

  const num = parseFloat(amount);

  if (isNaN(num)) {
    return {
      valid: false,
      message: "Số tiền không hợp lệ",
    };
  }

  if (num <= 0) {
    return {
      valid: false,
      message: "Số tiền phải lớn hơn 0",
    };
  }

  if (num > 1000) {
    return {
      valid: false,
      message: "Số tiền quá lớn",
    };
  }

  return {
    valid: true,
    message: "",
  };
};

/**
 * Validate địa chỉ người nhận
 * @param {string} address - Địa chỉ Ethereum
 * @param {string} currentAddress - Địa chỉ hiện tại (không được trùng)
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateDiaChiNguoiNhan = (address, currentAddress) => {
  if (!address || address.trim() === "") {
    return {
      valid: false,
      message: "Vui lòng nhập địa chỉ người nhận",
    };
  }

  if (!kiemTraDiaChi(address)) {
    return {
      valid: false,
      message: "Địa chỉ không hợp lệ",
    };
  }

  if (address.toLowerCase() === currentAddress.toLowerCase()) {
    return {
      valid: false,
      message: "Không thể gán cho chính mình",
    };
  }

  return {
    valid: true,
    message: "",
  };
};

/**
 * Sanitize input string (loại bỏ ký tự đặc biệt nguy hiểm)
 * @param {string} input - Chuỗi cần sanitize
 * @returns {string} - Chuỗi đã sanitize
 */
export const sanitizeInput = (input) => {
  if (!input) return "";

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<[^>]*>/g, ""); // Remove HTML tags
};
