'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { PageHeader } from '@/components/primitives/PageHeader';
import { EmptyState } from '@/components/primitives/EmptyState';
import { LoadingState } from '@/components/primitives/LoadingState';
import { Badge } from '@/components/ui/Badge';
import { AdminButton } from '@/components/ui/AdminButton';
import { formatTsh, formatPhone, cn } from '@/lib/utils';
import { ArrowPathIcon, InboxIcon, CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useOrders } from '../hooks/useOrders';
import { ORDERS_I18N } from '../constants';
export function AdminOrdersPage() {
  const { lang } = useI18n(); const text = ORDERS_I18N[lang];
  const [filter, setFilter] = useState('all'); const [expanded, setExpanded] = useState<string | null>(null);
  const { orders, loading, busyId, refresh, fulfill } = useOrders(filter);
  const statusColor = (s: string) => s === 'paid' || s === 'fulfilled' ? 'success' : s === 'cancelled' ? 'error' : 'warning';
  return (
    <div className="space-y-5">
      <PageHeader title={text.title} subtitle={text.subtitle} action={<AdminButton onClick={refresh} disabled={loading} variant="outline" size="icon"><ArrowPathIcon className={cn('h-4 w-4', loading && 'animate-spin')} /></AdminButton>} />
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {(['all','awaiting','paid','fulfilled'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border whitespace-nowrap transition', filter === f ? 'bg-brand text-white border-brand' : 'border-border-subtle text-text-secondary hover:border-brand/40 hover:text-text-primary')}>{f === 'all' ? text.all : f === 'awaiting' ? text.awaiting : f === 'paid' ? text.paid : text.fulfilled}</button>
          ))}
        </div>
      </div>
      {loading ? <LoadingState /> : orders.length === 0 ? (
        <EmptyState icon={InboxIcon} title={text.empty} description={text.emptyDesc} />
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {orders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="card overflow-hidden">
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="font-mono text-text-primary font-semibold text-xs sm:text-sm">{o.orderNumber}</span>
                    <Badge color={statusColor(o.status)}>{(text.status as any)[o.status] || o.status}</Badge>
                  </div>
                  <div className="font-display text-base sm:text-lg font-bold text-brand flex-shrink-0">{formatTsh(o.total)}</div>
                </div>
                <div className="text-xs sm:text-sm text-text-secondary truncate">{o.customerName} · {formatPhone(o.customerPhone)}</div>
                <div className="text-[10px] sm:text-xs text-text-muted mt-1">{o.items?.length || 0} {text.items} · {new Date(o.createdAt).toLocaleDateString(lang === 'sw' ? 'sw-TZ' : 'en-US')}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="flex-1 h-9 rounded-lg bg-bg-surface hover:bg-bg-elevated transition text-xs font-medium text-text-secondary flex items-center justify-center gap-1.5">
                    {expanded === o.id ? <><ChevronUpIcon className="h-3.5 w-3.5" /> {text.hide}</> : <><ChevronDownIcon className="h-3.5 w-3.5" /> {text.details}</>}
                  </button>
                  {o.status === 'paid' && (
                    <AdminButton onClick={() => fulfill(o.id)} disabled={busyId === o.id} variant="success" size="sm" icon={<CheckCircleIcon className="h-3.5 w-3.5" />}>{text.fulfill}</AdminButton>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {expanded === o.id && o.items?.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0 }} className="border-t border-border-subtle bg-bg-surface/50 p-3 sm:p-4 space-y-2">
                    {o.items.map((it: any) => (
                      <div key={it.id} className="flex justify-between items-center text-xs sm:text-sm gap-2">
                        <div className="min-w-0 truncate"><span className="text-text-primary">{it.productName}</span><span className="text-text-muted ml-2">{it.size && `· ${it.size}`}{it.color && ` · ${it.color}`}</span></div>
                        <div className="text-text-secondary flex-shrink-0">{it.quantity} × {formatTsh(it.unitPrice)}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
