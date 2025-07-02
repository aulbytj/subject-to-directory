import React, { forwardRef } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface PercentageInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const PercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const formatPercentage = (num: number): string => {
      if (num === 0) return '';
      return num.toString();
    };

    const parsePercentage = (str: string): number => {
      const cleaned = str.replace(/[^\d.]/g, '');
      return cleaned ? parseFloat(cleaned) : 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parsePercentage(e.target.value);
      onChange(numericValue);
    };

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          value={formatPercentage(value)}
          onChange={handleChange}
          className={cn("pr-8", className)}
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
      </div>
    );
  }
);

PercentageInput.displayName = 'PercentageInput';