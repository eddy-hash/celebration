'use client';
import { useTheme } from '@/providers/ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center h-9 w-9 rounded-xl',
        'border border-border-subtle bg-bg-elevated',
        'hover:bg-bg-surface transition-colors',
        className,
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4 text-gold" />
      ) : (
        <MoonIcon className="h-4 w-4 text-brand" />
      )}
    </button>
  );
}
