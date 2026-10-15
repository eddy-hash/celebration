'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { AdminApi } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { formatTsh, formatPhone } from '@/lib/utils';
import {
  UsersIcon, ShoppingBagIcon, CreditCardIcon, SparklesIcon,
  ArrowPathIcon, ClockIcon, CheckCircleIcon, TruckIcon,
  BanknotesIcon, InboxIcon,
} from '@heroicons/react/24/outline';

const T = {
  sw: {
    eyebrow: 'Dashibodi', welcome: 'Karibu', subtitle: 'Muhtasari wa sherehe',
    kpiInvited: 'Walioalikwa', kpiConfirmed: 'Wageni Wamekubali',
    kpiOrders: 'Oda Zote', kpiRevenue: 'Mapato',
    confirmedCount: 'wamekubali', pendingCount: 'wanasubiri',
    paidCount: 'zimelipwa', paymentsCount: 'malipo',
    uniformsTitle: 'Ufuatiliaji wa Kitambaa', totalCost: 'Jumla ya gharama',
    ordered: 'Zilizoagizwa', delivered: 'Zilizofikishwa',
    distributed: 'Zimesambazwa', without: 'Bila Sare',
    progressLabel: 'Wamepata kitambaa',
    pendingPaymentsTitle: 'Malipo yanasubiri uthibitisho',
    pendingPaymentsDesc: 'Una malipo {{count}} yanayohitaji uthibitisho',
    recentInvites: 'Waalikwa wa Karibuni', recentPayments: 'Malipo ya Karibuni',
    noInvites: 'Hakuna waalikwa bado', noPayments: 'Hakuna malipo bado',
  },
  en: {
    eyebrow: 'Dashboard', welcome: 'Welcome', subtitle: 'Celebration overview',
    kpiInvited: 'Invited', kpiConfirmed: 'Confirmed Guests',
    kpiOrders: 'Total Orders', kpiRevenue: 'Revenue',
    confirmedCount: 'confirmed', pendingCount: 'pending',
    paidCount: 'paid', paymentsCount: 'payments',
    uniformsTitle: 'Fabric Tracking', totalCost: 'Total cost',
    ordered: 'Ordered', delivered: 'Delivered',
    distributed: 'Distributed', without: 'Without Fabric',
    progressLabel: 'Received fabric',
    pendingPaymentsTitle: 'Payments awaiting verification',
    pendingPaymentsDesc: 'You have {{count}} payments needing verification',
    recentInvites: 'Recent Invites', recentPayments: 'Recent Payments',
    noInvites: 'No invites yet', noPayments: 'No payments yet',
  },
};

export default function AdminDashboard() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => {
    if (!tenantId) return;
    load();
  }, [tenantId]);

  async function load() {
    setRefreshing(true);
    try {
      const res = await AdminApi.analytics(tenantId);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { Icon: UsersIcon, label: text.kpiInvited,
      value: data?.invitations?.total || 0,
      sub: `${data?.invitations?.confirmed || 0} ${text.confirmedCount}`, color: 'brand' },
    { Icon: SparklesIcon, label: text.kpiConfirmed,
      value: data?.invitations?.confirmedGuests || 0,
      sub: `${data?.invitations?.pending || 0} ${text.pendingCount}`, color: 'gold' },
    { Icon: ShoppingBagIcon, label: text.kpiOrders,
      value: data?.orders?.total || 0,
      sub: `${data?.orders?.paid || 0} ${text.paidCount}`, color: 'brand' },
    { Icon: BanknotesIcon, label: text.kpiRevenue,
      value: formatTsh(data?.orders?.revenue || 0),
      sub: `${data?.payments?.successful || 0} ${text.paymentsCount}`, color: 'success' },
  ];

  const uniformStats = [
    { label: text.ordered, value: data?.uniforms?.ordered || 0, Icon: ClockIcon },
    { label: text.delivered, value: data?.uniforms?.delivered || 0, Icon: TruckIcon },
    { label: text.distributed, value: data?.uniforms?.distributed || 0, Icon: CheckCircleIcon },
    { label: text.without, value: data?.uniforms?.withoutUniform || 0, Icon: InboxIcon },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white mt-1">
            {text.welcome}
          </h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{text.subtitle}</p>
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="self-start sm:self-auto h-10 w-10 rounded-xl border border-border-subtle
                     flex items-center justify-center text-white hover:bg-bg-elevated transition"
        >
          <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s, i) => {
          const Icon = s.Icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="card p-3 sm:p-4 lg:p-5">
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-brand" />
                </div>
                <Badge color={s.color as any} className="text-[9px] sm:text-[10px]">{s.sub}</Badge>
              </div>
              <div className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white break-all">
                {s.value}
              </div>
              <div className="text-[10px] sm:text-xs text-text-muted mt-1">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Uniforms */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base sm:text-lg text-white">{text.uniformsTitle}</h2>
            <p className="text-text-muted text-[10px] sm:text-xs mt-1">
              {text.totalCost}: <span className="text-gold font-semibold">
                {formatTsh(data?.uniforms?.totalCost || 0)}
              </span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {uniformStats.map((u) => {
            const Icon = u.Icon;
            return (
              <div key={u.label} className="p-3 rounded-xl bg-bg-surface border border-border-subtle">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="h-3.5 w-3.5 text-brand" />
                  <span className="text-[10px] sm:text-xs text-text-muted">{u.label}</span>
                </div>
                <div className="font-display text-lg sm:text-xl font-bold text-white">{u.value}</div>
              </div>
            );
          })}
        </div>
        {data?.uniforms?.total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] sm:text-xs text-text-muted mb-2">
              <span>{text.progressLabel}</span>
              <span>{data.uniforms.withUniform} / {data.uniforms.total}</span>
            </div>
            <div className="h-2 rounded-full bg-bg-surface overflow-hidden">
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${Math.round((data.uniforms.withUniform / Math.max(data.uniforms.total, 1)) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-brand to-gold" />
            </div>
          </div>
        )}
      </div>

      {/* Pending payments */}
      {data?.payments?.pending > 0 && (
        <div className="card p-4 border-amber-500/40 bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
              <CreditCardIcon className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm">{text.pendingPaymentsTitle}</div>
              <div className="text-amber-300 text-xs mt-0.5">
                {text.pendingPaymentsDesc.replace('{{count}}', String(data.payments.pending))}
              </div>
            </div>
            <Badge color="warning">{data.payments.pending}</Badge>
          </div>
        </div>
      )}

      {/* Recent */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base sm:text-lg text-white">{text.recentInvites}</h3>
            <Badge color="brand">{data?.recent?.invites?.length || 0}</Badge>
          </div>
          {data?.recent?.invites?.length > 0 ? (
            <div className="space-y-2">
              {data.recent.invites.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-bg-surface">
                  <div className="min-w-0">
                    <div className="text-white text-xs sm:text-sm font-medium truncate">{inv.guestName}</div>
                    <div className="text-text-muted text-[10px] sm:text-xs">{formatPhone(inv.guestPhone)}</div>
                  </div>
                  <Badge color={inv.status === 'confirmed' ? 'success' : inv.status === 'declined' ? 'error' : 'warning'}>
                    {inv.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-text-muted text-xs">{text.noInvites}</div>
          )}
        </div>

        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base sm:text-lg text-white">{text.recentPayments}</h3>
            <Badge color="gold">{data?.recent?.payments?.length || 0}</Badge>
          </div>
          {data?.recent?.payments?.length > 0 ? (
            <div className="space-y-2">
              {data.recent.payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-bg-surface">
                  <div className="min-w-0">
                    <div className="text-white text-[11px] sm:text-sm font-mono truncate">{p.referenceCode}</div>
                    <div className="text-text-muted text-[10px] sm:text-xs truncate">
                      {p.customerName} · {formatTsh(p.amount)}
                    </div>
                  </div>
                  <Badge color={p.status === 'success' ? 'success' : p.status === 'awaiting_verification' ? 'warning' : 'neutral'}>
                    {p.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-text-muted text-xs">{text.noPayments}</div>
          )}
        </div>
      </div>
    </div>
  );
}
