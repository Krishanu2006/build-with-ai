import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  dataPreservedNotice?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  dataPreservedNotice = 'Your submitted information has been preserved in memory.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-5 bg-rose-50/70 border border-rose-200 rounded-lg text-brand-text ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-brand-error mt-0.5">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900 mb-1">{title}</h4>
          <p className="text-sm text-rose-800 mb-2">{message}</p>
          {dataPreservedNotice && (
            <p className="text-xs text-rose-700/90 font-medium mb-3">
              {dataPreservedNotice}
            </p>
          )}
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="bg-white border-rose-300 text-rose-900 hover:bg-rose-50"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
