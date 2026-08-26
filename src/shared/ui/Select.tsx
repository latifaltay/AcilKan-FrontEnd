import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  placeholder,
  error,
  fullWidth,
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const baseStyles =
    'rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed';
  const errorStyles = error ? 'border-red-500 dark:border-red-500' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthStyles} ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${baseStyles} ${errorStyles} px-4 py-2 w-full ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={props.required}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
