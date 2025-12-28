/**
 * @file Loading.jsx
 * @description Terminal-style loading components
 */

import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <svg className={`animate-spin ${sizes[size]} ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const TaskCardSkeleton = () => (
  <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
    <div className="h-0.5 bg-border" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
        <Skeleton className="h-5 w-16 rounded" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-3 w-28 rounded" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-border">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  </div>
);

const Loading = ({ text = 'Đang tải...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="font-mono text-sm text-center">
        <span className="text-neon-green">$</span>
        <span className="text-muted ml-2">{text}</span>
        <span className="animate-blink text-neon-green">_</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-surface/90 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{content}</div>;
};

export default Loading;
