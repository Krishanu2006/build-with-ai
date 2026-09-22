import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({
  id,
  label,
  required = false,
  optionalLabel,
  helperText,
  error,
  children,
  className = '',
}) => {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-brand-text tracking-tight"
        >
          {label}
          {required && (
            <span className="text-brand-error ml-1" title="Required field" aria-hidden="true">*</span>
          )}
        </label>
        {optionalLabel && !required && (
          <span className="text-xs text-brand-text-muted">{optionalLabel}</span>
        )}
      </div>

      <div>{children}</div>

      {helperText && !error && (
        <p id={helperId} className="text-xs text-brand-text-muted">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-xs text-brand-error flex items-center gap-1 font-medium mt-1"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
