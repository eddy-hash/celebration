'use client';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { formatTsh, formatPhone } from '@/lib/utils';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { Order } from '../types';
import { ItemRow } from './order/ItemRow';

function getStatusColor(s: string): 'success' | 'error' | 'warning' | 'neutral' {
  if (s === 'paid' || s === 'fulfilled') return 'success';
  if (s === 'cancelled') return 'error';
  if (s === 'awaiting_payment' || s === 'pending') return 'warning';
  return 'neutral';
}

export function EditableOrderCard({ order, text, lang, onSaved }: {
  order: Order; text: any; lang: 'sw' | 'en'; onSaved: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border-subtle bg-bg-surface/40 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2
                      px-4 py-3 bg-bg-surface border-b border-border-subtle">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-brand/10 border border-brand/30
                          flex items-center justify-center flex-shrink-0">
            <ShoppingBagIcon className="h-4 w-4 text-brand" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-text-primary font-bold text-xs sm:text-sm truncate">
              {order.orderNumber}
            </div>
            <div className="text-text-muted text-[10px] mt-0.5">
              {new Date(order.createdAt).toLocaleDateString(
                lang === 'sw' ? 'sw-TZ' : 'en-US',
                { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge color={getStatusColor(order.status)}>
            {text.statusLabels[order.status as keyof typeof text.statusLabels] || order.status}
          </Badge>
          <div className="font-display text-brand font-bold text-base sm:text-lg">
            {formatTsh(order.total)}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-bg-base/30 border-b border-border-subtle flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gold/20 border border-gold/40
                        flex items-center justify-center flex-shrink-0">
          <span className="text-gold text-xs font-bold">{order.customerName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-text-primary font-semibold text-xs sm:text-sm truncate">{order.customerName}</div>
          <div className="text-text-muted text-[10px]">{formatPhone(order.customerPhone)}</div>
        </div>
      </div>

      <div className="divide-y divide-border-subtle">
        {order.items?.map((item) => (
          <ItemRow key={item.id} item={item} text={text} onSaved={onSaved} />
        ))}
      </div>
    </motion.div>
  );
}
