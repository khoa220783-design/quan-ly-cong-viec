/**
 * @file Badge.jsx
 * @description Component Badge hiển thị trạng thái
 */

import React from 'react';

/**
 * Badge Component
 * @param {object} props
 * @param {string} props.children - Nội dung badge
 * @param {string} props.variant - Loại: success, warning, danger, info, default
 * @param {string} props.className - Custom class
 */
const Badge = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
