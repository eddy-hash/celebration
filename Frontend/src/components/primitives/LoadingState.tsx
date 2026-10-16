'use client';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text, className }: LoadingStateProps) {
  return (
    <div className={cn('card p-12 text-center', className)}>
      <div className="h-8 w-8 border-2 border-brand border-t-transparent
                      rounded-full animate-spin mx-auto" />
      {text && <p className="text-text-muted text-sm mt-3">{text}</p>}
    </div>
  );
}
