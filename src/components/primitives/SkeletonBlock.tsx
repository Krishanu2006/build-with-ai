import React from 'react';

export interface SkeletonBlockProps {
  className?: string;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-brand-surface-alt rounded ${className}`}
    />
  );
};
