'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { PageHeader } from '@/components/primitives/PageHeader';
import { EmptyState } from '@/components/primitives/EmptyState';
import { LoadingState } from '@/components/primitives/LoadingState';
import { Badge } from '@/components/ui/Badge';
import { AdminButton } from '@/components/ui/AdminButton';
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon, DocumentTextIcon, UserCircleIcon, ShieldCheckIcon, ClockIcon, InboxIcon } from '@heroicons/react/24/outline';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { AUDIT_I18N, ACTION_COLORS } from '../constants';
export function AdminAuditPage() {
  const { lang } = useI18n(); const text = AUDIT_I18N[lang];
  const [search, setSearch] = useState(''); const [action, setAction] = useState(''); const [range, setRange] = useState<'today'|'7d'|'30d'|'all'>('7d');
  const { logs, stats, loading, refresh } = useAuditLogs(action, range);
  const locale = lang === 'sw' ? 'sw-TZ' : 'en-US';
  return (
    <div className="space-y-5">
      <PageHeader title={text.title} subtitle={text.subtitle} action={<AdminButton onClick={refresh} disabled={loading} variant="outline" size="icon"><ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></AdminButton>} />
      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="card p-3 sm:p-4"><DocumentTextIcon className="h-4 w-4 text-brand mb-2" /><div className="font-display text-lg sm:text-2xl font-bold text-text-primary">{stats.total || 0}</div><div className="text-[10px] sm:text-xs text-text-muted mt-0.5 uppercase tracking-wider">{text.total}</div></div>
          <div className="card p-3 sm:p-4"><ClockIcon className="h-4 w-4 text-gold mb-2" /><div className="font-display text-lg sm:text-2xl font-bold text-text-primary">{stats.todayCount || 0}</div><div className="text-[10px] sm:text-xs text-text-muted mt-0.5 uppercase tracking-wider">{text.todayStat}</div></div>
        </div>
      )}
      <div className="space-y-2 sm:space-y-3">
        <div className="relative"><MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={text.search} className="w-full h-11 pl-10 pr-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted/60 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" /></div>
        <div className="grid grid-cols-2 gap-2">
          <select value={action} onChange={(e) => setAction(e.target.value)} className="h-11 px-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary text-xs sm:text-sm focus:outline-none focus:border-brand"><option value="">{text.allActions}</option><option value="admin_login">Admin Login</option><option value="guest_login">Guest Login</option><option value="invite_create">Invite</option><option value="order_create">Order</option><option value="payment_verify">Payment</option></select>
          <select value={range} onChange={(e) => setRange(e.target.value as any)} className="h-11 px-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary text-xs sm:text-sm focus:outline-none focus:border-brand"><option value="today">{text.today}</option><option value="7d">{text.last7}</option><option value="30d">{text.last30}</option><option value="all">{text.allTime}</option></select>
        </div>
      </div>
      {loading ? <LoadingState /> : logs.length === 0 ? <EmptyState icon={InboxIcon} title={text.empty} description={text.emptyDesc} /> : (
        <div className="space-y-2">
          {logs.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="card p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge color={ACTION_COLORS[log.action] || 'neutral'}>{log.action.replace(/_/g, ' ')}</Badge>
                <span className="text-[10px] sm:text-xs text-text-muted whitespace-nowrap">{new Date(log.createdAt).toLocaleString(locale, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                {log.actorRole === 'admin' ? <ShieldCheckIcon className="h-4 w-4 text-gold flex-shrink-0" /> : <UserCircleIcon className="h-4 w-4 text-brand flex-shrink-0" />}
                <span className="text-text-primary text-xs sm:text-sm font-medium truncate">{log.actorName || '—'}</span>
              </div>
              {log.description && <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">{log.description}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
