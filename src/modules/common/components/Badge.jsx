/**
 * @file Badge.jsx
 * @description Premium Badge Component với glow effects
 */

import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon,
  pulse = false,
}) => {

  // Size classes
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-dark-700/50 text-dark-300 border-dark-600',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    gradient: 'bg-gradient-to-r from-brand-500/10 to-cyan-500/10 text-white border-brand-500/20',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-full font-medium
        border
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Pulse indicator */}
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`
            animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
            ${variant === 'success' ? 'bg-emerald-400' :
              variant === 'danger' ? 'bg-red-400' :
                variant === 'warning' ? 'bg-amber-400' : 'bg-brand-400'}
          `} />
          <span className={`
            relative inline-flex rounded-full h-2 w-2
            ${variant === 'success' ? 'bg-emerald-400' :
              variant === 'danger' ? 'bg-red-400' :
                variant === 'warning' ? 'bg-amber-400' : 'bg-brand-400'}
          `} />
        </span>
      )}

      {/* Icon */}
      {icon && <span className="flex-shrink-0">{icon}</span>}

      {/* Content */}
      {children}
    </span>
  );
};

export default Badge;
