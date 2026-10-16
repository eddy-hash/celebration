'use client';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export function ModalHeader({
  action,
  text,
  onClose,
}: {
  action: 'verify' | 'reject';
  text: any;
  onClose: () => void;
}) {
  return (
    <div className="relative flex-shrink-0 px-6 pt-6 pb-5 border-b border-border-subtle">
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1',
          action === 'verify'
            ? 'bg-gradient-to-r from-brand via-brand-light to-brand'
            : 'bg-gradient-to-r from-red-500 via-red-400 to-red-500',
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0',
              action === 'verify'
                ? 'bg-brand/15 border border-brand/40'
                : 'bg-red-500/15 border border-red-500/40',
            )}
          >
            {action === 'verify' ? (
              <CheckCircleIcon className="h-6 w-6 text-brand" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl text-text-primary font-semibold">
              {action === 'verify' ? text.verify : text.reject}
            </h2>
            <p className="text-text-muted text-xs mt-0.5">
              {action === 'verify' ? text.txIdHelper : text.reasonHelper}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-xl flex items-center justify-center
                     text-text-muted hover:text-text-primary
                     hover:bg-bg-surface transition flex-shrink-0"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
