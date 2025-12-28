/**
 * @file Button.jsx
 * @description Premium Button Component với gradient variants và animations
 */

import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon,
  ...props
}) => {

  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
    xl: 'px-6 py-3.5 text-base gap-2.5',
  };

  // Variant classes
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-brand-500 to-brand-600 
      hover:from-brand-600 hover:to-brand-700
      text-white font-medium
      shadow-lg shadow-brand-500/25
      hover:shadow-xl hover:shadow-brand-500/30
      active:scale-[0.98]
    `,
    secondary: `
      bg-dark-700/50 
      hover:bg-dark-600/50
      text-dark-100 font-medium
      border border-dark-600
      hover:border-dark-500
    `,
    gradient: `
      bg-gradient-to-r from-brand-500 via-accent-pink to-accent-cyan
      bg-[length:200%_200%]
      animate-gradient
      text-white font-semibold
      shadow-lg shadow-brand-500/25
      hover:shadow-xl hover:shadow-brand-500/40
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent
      hover:bg-white/5
      text-dark-300
      hover:text-white
    `,
    danger: `
      bg-red-500/10
      hover:bg-red-500/20
      text-red-400
      hover:text-red-300
      border border-red-500/20
      hover:border-red-500/30
    `,
    success: `
      bg-emerald-500/10
      hover:bg-emerald-500/20
      text-emerald-400
      hover:text-emerald-300
      border border-emerald-500/20
      hover:border-emerald-500/30
    `,
    outline: `
      bg-transparent
      border-2 border-brand-500/50
      hover:border-brand-500
      text-brand-400
      hover:text-brand-300
      hover:bg-brand-500/5
    `,
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    rounded-xl font-medium
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900
  `;

  const finalClassName = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={finalClassName}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon */}
      {!loading && icon && (
        <span className="flex-shrink-0">{icon}</span>
      )}

      {/* Content */}
      {children}
    </button>
  );
};

export default Button;
