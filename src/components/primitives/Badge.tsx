import React from 'react';
import { SeverityLevel } from '../../types/domain';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'category' | 'severity' | 'status' | 'neutral' | 'language';
  severity?: SeverityLevel;
  status?: 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  severity,
  status = 'info',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  const base = 'inline-flex items-center font-medium rounded-full border shrink-0';

  if (variant === 'severity' && severity) {
    if (severity === 'high') {
      return (
        <span className={`${base} ${sizeStyles} bg-brand-primary text-white border-brand-primary ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5" aria-hidden="true" />
          High Severity
        </span>
      );
    }
    if (severity === 'medium') {
      return (
        <span className={`${base} ${sizeStyles} bg-[#5789B3] text-white border-[#5789B3] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-200 mr-1.5" aria-hidden="true" />
          Medium Severity
        </span>
      );
    }
    return (
      <span className={`${base} ${sizeStyles} bg-[#B9CFE3] text-[#16202B] border-[#89AECD] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5" aria-hidden="true" />
        Low Severity
      </span>
    );
  }

  if (variant === 'category') {
    return (
      <span className={`${base} ${sizeStyles} bg-brand-surface-alt text-brand-text border-brand-border ${className}`}>
        {children}
      </span>
    );
  }

  if (variant === 'language') {
    return (
      <span className={`${base} ${sizeStyles} bg-emerald-50 text-emerald-800 border-emerald-200 uppercase font-mono tracking-wider ${className}`}>
        {children}
      </span>
    );
  }

  if (variant === 'status') {
    const statusMap = {
      success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      warning: 'bg-amber-50 text-amber-800 border-amber-200',
      error: 'bg-rose-50 text-rose-800 border-rose-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200',
    };
    return (
      <span className={`${base} ${sizeStyles} ${statusMap[status]} ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`${base} ${sizeStyles} bg-gray-100 text-gray-800 border-gray-200 ${className}`}>
      {children}
    </span>
  );
};
