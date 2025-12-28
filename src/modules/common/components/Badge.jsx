/**
 * @file Badge.jsx
 * @description Badge component với light/dark support
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

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
  };

  const variantClasses = {
    default: 'bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300',
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
    info: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    brand: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-full font-medium
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`
            animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
            ${variant === 'success' ? 'bg-emerald-400' :
              variant === 'danger' ? 'bg-red-400' :
                variant === 'warning' ? 'bg-amber-400' : 'bg-violet-400'}
          `} />
          <span className={`
            relative inline-flex rounded-full h-2 w-2
            ${variant === 'success' ? 'bg-emerald-500' :
              variant === 'danger' ? 'bg-red-500' :
                variant === 'warning' ? 'bg-amber-500' : 'bg-violet-500'}
          `} />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
