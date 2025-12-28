/**
 * @file Loading.jsx
 * @description Premium Loading components với skeleton và spinners
 */

import React from 'react';

/**
 * Spinner Component
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
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
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * Skeleton Component
 */
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variantClasses = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'w-10 h-10 rounded-full',
    button: 'h-10 w-24 rounded-xl',
    card: 'h-40 rounded-xl',
  };

  return (
    <div
      className={`
        skeleton
        ${variantClasses[variant]}
        ${className}
      `}
      aria-hidden="true"
    />
  );
};

/**
 * TaskCard Skeleton
 */
export const TaskCardSkeleton = () => (
  <div className="glass rounded-xl p-5 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton variant="title" className="w-3/4" />
        <Skeleton className="w-full" />
        <Skeleton className="w-1/2" />
      </div>
      <Skeleton variant="button" className="w-20 h-6" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-40" />
      <Skeleton className="w-32" />
    </div>
    <div className="flex gap-2 pt-2 border-t border-white/5">
      <Skeleton variant="button" className="w-8 h-8" />
      <Skeleton variant="button" className="w-8 h-8" />
    </div>
  </div>
);

/**
 * Full Page Loading
 */
const Loading = ({ text = 'Đang tải...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center animate-pulse">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan blur-xl opacity-50 animate-pulse" />
      </div>

      {/* Text */}
      <div className="flex items-center gap-2 text-dark-300">
        <Spinner size="sm" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default Loading;
