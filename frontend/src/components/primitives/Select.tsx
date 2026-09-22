import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 text-sm bg-white border rounded text-brand-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:border-brand-primary disabled:bg-brand-surface-alt disabled:cursor-not-allowed ${
        error ? 'border-brand-error' : 'border-brand-border hover:border-gray-400'
      } ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
