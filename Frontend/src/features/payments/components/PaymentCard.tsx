'use client';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { AdminButton } from '@/components/ui/AdminButton';
import { formatTsh, formatPhone } from '@/lib/utils';
import { CreditCardIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { PendingPayment, PaymentAction } from '../types';

interface PaymentCardProps {
  payment: PendingPayment;
  index: number;
  text: any;
  lang: 'sw' | 'en';
  onAction: (id: string, action: PaymentAction) => void;
}

export function PaymentCard({ payment, index, text, lang, onAction }: PaymentCardProps) {
  const p = payment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="card p-4 sm:p-5"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl bg-brand/10 border border-brand/30
                          flex items-center justify-center flex-shrink-0">
            <CreditCardIcon className="h-5 w-5 text-brand" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-text-primary font-bold text-sm truncate">
              {p.referenceCode}
            </div>
            <div className="text-text-muted text-[11px] mt-0.5">
              {new Date(p.customerConfirmedAt || p.createdAt).toLocaleString(
                lang === 'sw' ? 'sw-TZ' : 'en-US',
                { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
              )}
            </div>
          </div>
        </div>
        <Badge color={p.status === 'awaiting_verification' ? 'warning' : 'neutral'}>
          {p.status === 'awaiting_verification' ? text.awaiting : text.pending}
        </Badge>
      </div>

      {/* Customer + Amount */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                      gap-3 py-4 border-y border-border-subtle">
        <div>
          <div className="text-text-primary font-semibold text-sm">{p.customerName}</div>
          <div className="text-text-muted text-xs mt-1">{formatPhone(p.customerPhone)}</div>
        </div>
        <div className="font-display text-2xl sm:text-3xl font-bold text-brand">
          {formatTsh(p.amount)}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
        <AdminButton
          onClick={() => onAction(p.id, 'verify')}
          variant="success"
          size="md"
          icon={<CheckCircleIcon className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          {text.verify}
        </AdminButton>
        <AdminButton
          onClick={() => onAction(p.id, 'reject')}
          variant="danger"
          size="md"
          icon={<XCircleIcon className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          {text.reject}
        </AdminButton>
      </div>
    </motion.div>
  );
}
