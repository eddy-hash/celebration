'use client';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, label, error, ...rest }, ref) => (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={cn('input', error && 'border-red-500', className)} {...rest} />
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
