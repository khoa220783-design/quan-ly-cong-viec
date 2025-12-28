/**
 * @file Badge.jsx
 * @description Terminal-style blocky badges
 */

import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  pulse = false,
  className = '',
}) => {

  const sizes = {
    xs: 'px-1.5 py-0.5 text-2xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const variants = {
    default: 'bg-surface-hover text-secondary border-border',
    success: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    warning: 'bg-neon-orange/10 text-neon-orange border-neon-orange/30',
    danger: 'bg-neon-red/10 text-neon-red border-neon-red/30',
    info: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    brand: 'bg-neon-green/10 text-neon-green border-neon-green/30',
  };

  return (
    <span className={`
      inline-flex items-center gap-1
      font-mono font-semibold uppercase tracking-wider
      border rounded
      ${sizes[size]}
      ${variants[variant]}
      ${className}
    `}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`
            animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
            ${variant === 'success' ? 'bg-neon-green' :
              variant === 'danger' ? 'bg-neon-red' :
                variant === 'warning' ? 'bg-neon-orange' : 'bg-neon-cyan'}
          `} />
          <span className={`
            relative inline-flex rounded-full h-1.5 w-1.5
            ${variant === 'success' ? 'bg-neon-green' :
              variant === 'danger' ? 'bg-neon-red' :
                variant === 'warning' ? 'bg-neon-orange' : 'bg-neon-cyan'}
          `} />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
};

export default Badge;
