import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
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
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={`
            ${baseStyles}
            ${errorStyles}
            ${Icon ? 'pl-10' : 'pl-4'}
            py-2 pr-4
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};