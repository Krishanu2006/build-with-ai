import React from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  busy?: boolean;
  busyText?: string;
  icon?: React.ReactNode;
  disabledReason?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  busy = false,
  busyText,
  icon,
  disabledReason,
  disabled,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || busy;

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:ring-offset-2 select-none active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  }[size];

  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-level-1',
    secondary: 'bg-brand-secondary text-white hover:opacity-95 shadow-level-1',
    outline: 'border border-brand-border bg-white text-brand-text hover:bg-brand-surface-alt',
    subtle: 'bg-transparent text-brand-text hover:bg-brand-surface-alt',
    danger: 'bg-brand-error text-white hover:opacity-95 shadow-level-1',
  }[variant];

  return (
    <div className="inline-block relative">
      <button
        {...props}
        disabled={isDisabled}
        aria-busy={busy}
        aria-disabled={isDisabled}
        title={disabledReason || props.title}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      >
        {busy ? (
          <>
            <Spinner size="sm" className={variant === 'outline' || variant === 'subtle' ? 'text-brand-text' : 'text-white'} />
            <span>{busyText || children}</span>
          </>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </button>
      {disabled && disabledReason && (
        <span className="sr-only">{disabledReason}</span>
      )}
    </div>
  );
};
