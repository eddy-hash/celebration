'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { formatTsh, formatPhone } from '@/lib/utils';
import {
  ArrowPathIcon, InboxIcon, CheckCircleIcon,
  ChevronDownIcon, ChevronUpIcon,
} from '@heroicons/react/24/outline';

const T = {
  sw: {
    title: 'Oda', subtitle: 'Oda zote za waalikwa',
    empty: 'Hakuna oda bado', emptyDesc: 'Oda zitaonekana hapa',
    all: 'Zote', awaiting: 'Zinasubiri', paid: 'Zimelipwa', fulfilled: 'Zimekamilika',
    items: 'bidhaa', fulfill: 'Kamilisha', details: 'Maelezo', hide: 'Funga',
    status: { awaiting_payment: 'Inasubiri Malipo', paid: 'Imelipwa',
      fulfilled: 'Imekamilika', cancelled: 'Imefutwa', pending: 'Inasubiri' },
  },
  en: {
    title: 'Orders', subtitle: 'All guest orders',
    empty: 'No orders yet', emptyDesc: 'Orders will appear here',
    all: 'All', awaiting: 'Awaiting', paid: 'Paid', fulfilled: 'Fulfilled',
    items: 'items', fulfill: 'Fulfill', details: 'Details', hide: 'Hide',
    status: { awaiting_payment: 'Awaiting Payment', paid: 'Paid',
      fulfilled: 'Fulfilled', cancelled: 'Cancelled', pending: 'Pending' },
  },
};

export default function OrdersPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => { load(); }, [tenantId, filter]);

  async function load() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const params: any = { tenantId };
      if (filter !== 'all') params.status = filter === 'awaiting' ? 'awaiting_payment' : filter;
      const res = await api.get('/orders', { params });
      setOrders(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fulfill(id: string) {
    if (!confirm(lang === 'sw' ? 'Kamilisha oda hii?' : 'Fulfill this order?')) return;
    try {
      await api.patch(`/orders/${id}/fulfill`);
      await load();
    } catch (e) { console.error(e); }
  }

  const statusColor = (s: string): 'success' | 'error' | 'warning' =>
    s === 'paid' || s === 'fulfilled' ? 'success'
      : s === 'cancelled' ? 'error' : 'warning';

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">{text.title}</h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{text.subtitle}</p>
        </div>
        <button
          onClick={load}
          className="self-start sm:self-auto h-10 w-10 rounded-xl border border-border-subtle
                     flex items-center justify-center text-text-primary hover:bg-bg-elevated transition"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {(['all', 'awaiting', 'paid', 'fulfilled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border whitespace-nowrap transition ${
                filter === f
                  ? 'bg-brand text-text-primary border-brand'
                  : 'border-border-subtle text-text-secondary hover:border-brand/40 hover:text-text-primary'
              }`}
            >
              {f === 'all' ? text.all : f === 'awaiting' ? text.awaiting : f === 'paid' ? text.paid : text.fulfilled}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <InboxIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-white text-base sm:text-lg font-semibold">{text.empty}</h3>
          <p className="text-text-muted text-xs sm:text-sm mt-1">{text.emptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {orders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }} className="card overflow-hidden">
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="font-mono text-text-primary font-semibold text-xs sm:text-sm">
                      {o.orderNumber}
                    </span>
                    <Badge color={statusColor(o.status)}>
                      {(text.status as any)[o.status] || o.status}
                    </Badge>
                  </div>
                  <div className="font-display text-base sm:text-lg font-bold text-brand flex-shrink-0">
                    {formatTsh(o.total)}
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-text-secondary truncate">
                  {o.customerName} · {formatPhone(o.customerPhone)}
                </div>
                <div className="text-[10px] sm:text-xs text-text-muted mt-1">
                  {o.items?.length || 0} {text.items} · {new Date(o.createdAt).toLocaleDateString(
                    lang === 'sw' ? 'sw-TZ' : 'en-US',
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    className="flex-1 h-9 rounded-lg bg-bg-surface hover:bg-bg-elevated transition
                               text-xs font-medium text-text-secondary flex items-center justify-center gap-1.5"
                  >
                    {expanded === o.id
                      ? <><ChevronUpIcon className="h-3.5 w-3.5" /> {text.hide}</>
                      : <><ChevronDownIcon className="h-3.5 w-3.5" /> {text.details}</>}
                  </button>
                  {o.status === 'paid' && (
                    <button
                      onClick={() => fulfill(o.id)}
                      className="flex-1 h-9 rounded-lg bg-brand text-text-primary text-xs font-semibold
                                 hover:bg-brand-dark transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      {text.fulfill}
                    </button>
                  )}
                </div>
              </div>

              {expanded === o.id && o.items?.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-border-subtle bg-bg-surface/50 p-3 sm:p-4 space-y-2"
                >
                  {o.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center text-xs sm:text-sm gap-2">
                      <div className="min-w-0 truncate">
                        <span className="text-white">{it.productName}</span>
                        <span className="text-text-muted ml-2">
                          {it.size && `· ${it.size}`}
                          {it.color && ` · ${it.color}`}
                        </span>
                      </div>
                      <div className="text-text-secondary flex-shrink-0">
                        {it.quantity} × {formatTsh(it.unitPrice)}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
