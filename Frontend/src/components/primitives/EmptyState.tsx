'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn('card p-8 sm:p-12 text-center', className)}
    >
      <div className="h-16 w-16 mx-auto rounded-2xl bg-brand/10 border border-brand/30
                      flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-brand" />
      </div>
      <h3 className="text-text-primary text-base sm:text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-text-muted text-xs sm:text-sm mt-1">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
