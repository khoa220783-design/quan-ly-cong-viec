/**
 * @file Button.jsx
 * @description Neo-Brutalist Button với neon glow effects
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

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const variants = {
    primary: `
      bg-neon-green text-white font-semibold
      hover:shadow-neon-green hover:-translate-y-0.5
      active:translate-y-0
    `,
    secondary: `
      bg-surface-hover text-primary font-medium
      border border-border
      hover:bg-border hover:border-border-strong
    `,
    ghost: `
      bg-transparent text-secondary
      hover:text-primary hover:bg-surface-hover/50
    `,
    danger: `
      bg-neon-red/10 text-neon-red font-medium
      border border-neon-red/30
      hover:bg-neon-red/20 hover:border-neon-red/50
    `,
    outline: `
      bg-transparent text-neon-green font-medium
      border border-neon-green/50
      hover:bg-neon-green/10 hover:border-neon-green
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center
        rounded-lg font-mono tracking-wide
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon}
      {children}
    </button>
  );
};

export default Button;
