import { cn } from '@/lib/utils';
type C = 'brand' | 'gold' | 'success' | 'warning' | 'error' | 'neutral';
const colors: Record<C, string> = {
  brand: 'bg-brand/15 text-brand border-brand/30',
  gold: 'bg-gold/15 text-gold border-gold/30',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
  neutral: 'bg-bg-surface text-text-secondary border-border-subtle',
};
export function Badge({ children, color = 'neutral', className }: { children: React.ReactNode; color?: C; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold', colors[color], className)}>{children}</span>;
}
