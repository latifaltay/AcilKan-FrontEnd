import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500';
  const errorStyles = error ? 'border-red-500' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthStyles} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`
          ${baseStyles}
          ${errorStyles}
          px-4 py-2
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};