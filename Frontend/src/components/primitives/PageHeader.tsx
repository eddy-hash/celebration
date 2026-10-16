'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, action, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary mt-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          {action}
        </div>
      )}
    </motion.div>
  );
}
