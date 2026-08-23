import React from 'react';
import { cn } from './Button';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              ref={ref}
              className={cn(
                'peer h-5 w-5 appearance-none border border-gray-300 transition-all checked:bg-primary checked:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
            <svg
              className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {label && (
            <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
