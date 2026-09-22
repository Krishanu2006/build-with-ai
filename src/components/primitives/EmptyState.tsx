import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center bg-white border border-brand-border rounded-lg shadow-level-1 flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-brand-surface-alt flex items-center justify-center text-brand-text-muted mb-3" aria-hidden="true">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-brand-text mb-1">{title}</h3>
      <p className="text-sm text-brand-text-muted max-w-md mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
