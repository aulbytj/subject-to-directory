import React, { forwardRef } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface YearsInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const YearsInput = forwardRef<HTMLInputElement, YearsInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const formatYears = (num: number): string => {
      if (num === 0) return '';
      return num.toString();
    };

    const parseYears = (str: string): number => {
      const cleaned = str.replace(/[^\d]/g, '');
      return cleaned ? parseInt(cleaned, 10) : 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseYears(e.target.value);
      onChange(numericValue);
    };

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          value={formatYears(value)}
          onChange={handleChange}
          className={cn("pr-16", className)}
          placeholder="30"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          years
        </span>
      </div>
    );
  }
);

YearsInput.displayName = 'YearsInput';