/**
 * @file Button.jsx
 * @description Premium Button với light/dark support
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

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
  };

  const variantClasses = {
    primary: `
      bg-violet-500 hover:bg-violet-600 
      text-white font-medium
      shadow-sm hover:shadow-md
      active:scale-[0.98]
    `,
    secondary: `
      bg-zinc-100 dark:bg-zinc-700/50 
      hover:bg-zinc-200 dark:hover:bg-zinc-700
      text-zinc-700 dark:text-zinc-200 font-medium
    `,
    gradient: `
      bg-gradient-to-r from-violet-500 to-violet-600
      hover:from-violet-600 hover:to-violet-700
      text-white font-medium
      shadow-md shadow-violet-500/20
      hover:shadow-lg hover:shadow-violet-500/25
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent
      hover:bg-zinc-100 dark:hover:bg-zinc-800
      text-zinc-600 dark:text-zinc-300
      hover:text-zinc-900 dark:hover:text-white
    `,
    danger: `
      bg-red-500 hover:bg-red-600
      text-white font-medium
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent
      border-2 border-violet-500/50
      hover:border-violet-500
      text-violet-600 dark:text-violet-400
      hover:bg-violet-50 dark:hover:bg-violet-500/10
    `,
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    rounded-xl font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
    dark:focus-visible:ring-offset-zinc-900
  `;

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
