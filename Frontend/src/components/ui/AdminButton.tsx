'use client';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'brand' | 'success' | 'danger' | 'warning' | 'gold' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  soft?: boolean;
}

const SOLID: Record<Variant, string> = {
  brand:
    'bg-brand text-white border border-brand/50 hover:bg-brand-dark ' +
    'shadow-[0_4px_16px_rgba(233,30,99,0.3)] hover:shadow-[0_6px_20px_rgba(233,30,99,0.4)]',
  success:
    'bg-emerald-500 text-white border border-emerald-400/50 hover:bg-emerald-600 ' +
    'shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)]',
  danger:
    'bg-red-500 text-white border border-red-400/50 hover:bg-red-600 ' +
    'shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)]',
  warning:
    'bg-amber-500 text-white border border-amber-400/50 hover:bg-amber-600 ' +
    'shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)]',
  gold:
    'bg-gold text-white border border-gold/50 hover:brightness-110 ' +
    'shadow-[0_4px_16px_rgba(212,160,23,0.3)] hover:shadow-[0_6px_20px_rgba(212,160,23,0.4)]',
  ghost:
    'bg-transparent text-text-primary border border-border-subtle ' +
    'hover:bg-bg-elevated hover:border-text-muted',
  outline:
    'bg-bg-surface/50 text-text-primary border border-border-subtle ' +
    'hover:bg-bg-surface hover:border-brand/40 hover:text-brand',
};

const SOFT: Record<Variant, string> = {
  brand: 'bg-brand/10 text-brand border border-brand/30 hover:bg-brand/20',
  success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20',
  danger: 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20',
  gold: 'bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20',
  ghost: 'bg-transparent text-text-secondary border border-border-subtle hover:bg-bg-elevated hover:text-text-primary',
  outline: 'bg-bg-surface/50 text-text-primary border border-border-subtle hover:bg-bg-surface',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
  icon: 'h-10 w-10 rounded-xl',
};

export const AdminButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'brand', size = 'md', loading, icon, soft, children, disabled, ...rest }, ref) => {
    const baseStyles = soft ? SOFT[variant] : SOLID[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold',
          'transition-all duration-200 ease-out',
          'active:scale-[0.97]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2 focus:ring-offset-bg-base',
          'select-none whitespace-nowrap',
          baseStyles,
          SIZES[size],
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span className="h-4 w-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  },
);

AdminButton.displayName = 'AdminButton';
