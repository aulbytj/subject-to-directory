import React, { forwardRef } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const formatCurrency = (num: number): string => {
      if (num === 0) return '';
      return num.toLocaleString('en-US');
    };

    const parseCurrency = (str: string): number => {
      const cleaned = str.replace(/[^\d]/g, '');
      return cleaned ? parseInt(cleaned, 10) : 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseCurrency(e.target.value);
      onChange(numericValue);
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
        <Input
          {...props}
          ref={ref}
          value={formatCurrency(value)}
          onChange={handleChange}
          className={cn("pl-8", className)}
          placeholder="0"
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';