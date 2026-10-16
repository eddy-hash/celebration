'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import {
  MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon,
  DocumentTextIcon, UserCircleIcon, ShieldCheckIcon,
  ClockIcon, InboxIcon,
} from '@heroicons/react/24/outline';

const T = {
  sw: {
    title: 'Kumbukumbu', subtitle: 'Shughuli za mfumo',
    search: 'Tafuta...', allActions: 'Vitendo Vyote',
    today: 'Leo', last7: 'Siku 7', last30: 'Siku 30', allTime: 'Zote',
    empty: 'Hakuna kumbukumbu', emptyDesc: 'Hakuna shughuli bado',
    total: 'Jumla', todayStat: 'Za Leo', filter: 'Chuja',
  },
  en: {
    title: 'Audit Logs', subtitle: 'System activity',
    search: 'Search...', allActions: 'All Actions',
    today: 'Today', last7: '7 Days', last30: '30 Days', allTime: 'All',
    empty: 'No audit logs', emptyDesc: 'No activity yet',
    total: 'Total', todayStat: 'Today', filter: 'Filter',
  },
};

const ACTION_COLORS: Record<string, any> = {
  admin_login: 'success', admin_login_failed: 'error', admin_logout: 'neutral',
  guest_login: 'brand', guest_login_failed: 'error',
  invite_create: 'brand', invite_delete: 'error',
  invite_confirm: 'success', invite_decline: 'warning',
  order_create: 'brand', order_fulfill: 'success',
  payment_verify: 'success', payment_reject: 'error',
  uniform_deliver: 'brand', uniform_distribute: 'success',
};

export default function AuditLogsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [stats, setStats] = useState<any>(null);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => { load(); }, [tenantId, actionFilter, rangeFilter]);

  function computeFrom(range: string): Date | null {
    const d = new Date();
    if (range === 'today') { d.setHours(0, 0, 0, 0); return d; }
    if (range === '7d') { d.setDate(d.getDate() - 7); return d; }
    if (range === '30d') { d.setDate(d.getDate() - 30); return d; }
    return null;
  }

  async function load() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const from = computeFrom(rangeFilter);
      const [logsRes, statsRes] = await Promise.all([
        api.get('/audit', {
          params: {
            tenantId,
            action: actionFilter || undefined,
            from: from?.toISOString(),
            search: search || undefined,
            limit: 100,
          },
        }),
        api.get('/audit/stats', { params: { tenantId } }),
      ]);
      setLogs(logsRes.data.items || []);
      setStats(statsRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
  }

  const locale = lang === 'sw' ? 'sw-TZ' : 'en-US';

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary">{text.title}</h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{text.subtitle}</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="self-start sm:self-auto h-10 w-10 rounded-xl border border-border-subtle
                     flex items-center justify-center text-text-primary hover:bg-bg-elevated transition"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="card p-3 sm:p-4">
            <DocumentTextIcon className="h-4 w-4 text-brand mb-2" />
            <div className="font-display text-lg sm:text-2xl font-bold text-text-primary">
              {stats.total || 0}
            </div>
            <div className="text-[10px] sm:text-xs text-text-muted mt-0.5 uppercase tracking-wider">
              {text.total}
            </div>
          </div>
          <div className="card p-3 sm:p-4">
            <ClockIcon className="h-4 w-4 text-gold mb-2" />
            <div className="font-display text-lg sm:text-2xl font-bold text-text-primary">
              {stats.todayCount || 0}
            </div>
            <div className="text-[10px] sm:text-xs text-text-muted mt-0.5 uppercase tracking-wider">
              {text.todayStat}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-2 sm:space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={text.search}
            className="w-full h-11 pl-10 pr-3 rounded-xl bg-bg-elevated border border-border-subtle
                       text-text-primary placeholder-text-muted/60 text-sm
                       focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-11 px-3 rounded-xl bg-bg-elevated border border-border-subtle
                       text-text-primary text-xs sm:text-sm focus:outline-none focus:border-brand"
          >
            <option value="">{text.allActions}</option>
            <option value="admin_login">Admin Login</option>
            <option value="guest_login">Guest Login</option>
            <option value="invite_create">Invite</option>
            <option value="order_create">Order</option>
            <option value="payment_verify">Payment</option>
          </select>
          <select
            value={rangeFilter}
            onChange={(e) => setRangeFilter(e.target.value as any)}
            className="h-11 px-3 rounded-xl bg-bg-elevated border border-border-subtle
                       text-text-primary text-xs sm:text-sm focus:outline-none focus:border-brand"
          >
            <option value="today">{text.today}</option>
            <option value="7d">{text.last7}</option>
            <option value="30d">{text.last30}</option>
            <option value="all">{text.allTime}</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-bg-surface hover:bg-bg-elevated transition
                     text-text-primary text-sm font-medium flex items-center justify-center gap-2
                     border border-border-subtle"
        >
          <FunnelIcon className="h-4 w-4" />
          {text.filter}
        </button>
      </form>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : logs.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <InboxIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-text-primary text-base sm:text-lg font-semibold">{text.empty}</h3>
          <p className="text-text-muted text-xs sm:text-sm mt-1">{text.emptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }} className="card p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge color={ACTION_COLORS[log.action] || 'neutral'}>
                  {log.action.replace(/_/g, ' ')}
                </Badge>
                <span className="text-[10px] sm:text-xs text-text-muted whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString(locale, {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                {log.actorRole === 'admin'
                  ? <ShieldCheckIcon className="h-4 w-4 text-gold flex-shrink-0" />
                  : <UserCircleIcon className="h-4 w-4 text-brand flex-shrink-0" />
                }
                <span className="text-text-primary text-xs sm:text-sm font-medium truncate">
                  {log.actorName || '—'}
                </span>
              </div>
              {log.description && (
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                  {log.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
