'use client';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

type Variant = 'primary' | 'ghost' | 'whatsapp' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size; loading?: boolean;
}

const V: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-button hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98]',
  ghost: 'border border-border-subtle text-text-primary hover:bg-bg-elevated',
  whatsapp: 'bg-[#25D366] text-white hover:brightness-110',
  danger: 'bg-red-500 text-text-primary hover:bg-red-600',
};
const S: Record<Size, string> = { sm: 'h-9 px-4 text-sm', md: 'h-12 px-6', lg: 'h-14 px-8 text-lg' };

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...rest }, ref) => (
    <button ref={ref} disabled={disabled || loading}
      className={cn('inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', V[variant], S[size], className)}
      {...rest}>
      {loading ? <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{children}</> : children}
    </button>
  ),
);
Button.displayName = 'Button';
