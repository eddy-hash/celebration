'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { formatTsh } from '@/lib/utils';
import {
  SparklesIcon, ArrowPathIcon, InboxIcon,
  ClockIcon, TruckIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';

const T = {
  sw: {
    title: 'Kitambaa', subtitle: 'Fuatilia usambazaji wa kitambaa',
    empty: 'Hakuna kitambaa bado', emptyDesc: 'Kitambaa kitaonekana hapa',
    ordered: 'Zilizoagizwa', delivered: 'Zilizofikishwa', distributed: 'Zimesambazwa',
    cost: 'Gharama',
    delivered_s: 'Imefikishwa', distributed_s: 'Imesambazwa',
    ordered_s: 'Imeagizwa', not_ordered_s: 'Haijaagizwa',
    markDelivered: 'Fikisha', markDistributed: 'Sambaza',
  },
  en: {
    title: 'Fabrics', subtitle: 'Track fabric distribution',
    empty: 'No fabrics yet', emptyDesc: 'Fabrics will appear here',
    ordered: 'Ordered', delivered: 'Delivered', distributed: 'Distributed',
    cost: 'Cost',
    delivered_s: 'Delivered', distributed_s: 'Distributed',
    ordered_s: 'Ordered', not_ordered_s: 'Not Ordered',
    markDelivered: 'Deliver', markDistributed: 'Distribute',
  },
};

export default function UniformsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => { load(); }, [tenantId]);

  async function load() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const [r, s] = await Promise.all([
        api.get(`/uniforms/tenant/${tenantId}`),
        api.get(`/uniforms/tenant/${tenantId}/stats`),
      ]);
      setRows(r.data || []);
      setStats(s.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/uniforms/${id}`, { status });
      await load();
    } catch (e) { console.error(e); }
  }

  const labelFor = (s: string) =>
    s === 'delivered' ? text.delivered_s
      : s === 'distributed' ? text.distributed_s
      : s === 'ordered' ? text.ordered_s : text.not_ordered_s;

  const colorFor = (s: string): 'success' | 'brand' | 'warning' | 'neutral' =>
    s === 'distributed' ? 'success' : s === 'delivered' ? 'brand'
      : s === 'ordered' ? 'warning' : 'neutral';

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
                     flex items-center justify-center text-white hover:bg-bg-elevated transition"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: text.ordered, value: stats.ordered, Icon: ClockIcon, tone: 'text-white' },
            { label: text.delivered, value: stats.delivered, Icon: TruckIcon, tone: 'text-brand' },
            { label: text.distributed, value: stats.distributed, Icon: CheckCircleIcon, tone: 'text-emerald-400' },
            { label: text.cost, value: formatTsh(stats.totalCost || 0), Icon: SparklesIcon, tone: 'text-gold' },
          ].map((s) => {
            const Icon = s.Icon;
            return (
              <div key={s.label} className="card p-3 sm:p-4">
                <Icon className="h-4 w-4 text-brand mb-2" />
                <div className={`font-display text-lg sm:text-xl font-bold break-all ${s.tone}`}>
                  {s.value}
                </div>
                <div className="text-[10px] sm:text-xs text-text-muted mt-0.5 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="card p-12 text-center">
          <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : rows.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <InboxIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-white text-base sm:text-lg font-semibold">{text.empty}</h3>
          <p className="text-text-muted text-xs sm:text-sm mt-1">{text.emptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {rows.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }} className="card p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm sm:text-base truncate">
                      {u.guestName}
                    </span>
                    <Badge color={colorFor(u.status)}>{labelFor(u.status)}</Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-text-secondary mt-1">
                    {u.size && `${u.size}`}
                    {u.color && ` · ${u.color}`}
                    {` · ×${u.quantity || 1}`}
                    {u.cost > 0 && ` · ${formatTsh(u.cost)}`}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {u.status === 'not_ordered' && (
                  <button
                    onClick={() => updateStatus(u.id, 'ordered')}
                    className="flex-1 h-9 rounded-lg bg-bg-surface hover:bg-bg-elevated transition
                               text-xs font-medium text-text-secondary flex items-center justify-center gap-1.5"
                  >
                    <ClockIcon className="h-3.5 w-3.5" />
                    {text.ordered_s}
                  </button>
                )}
                {u.status === 'ordered' && (
                  <button
                    onClick={() => updateStatus(u.id, 'delivered')}
                    className="flex-1 h-9 rounded-lg bg-brand/20 hover:bg-brand/30 transition
                               text-xs font-medium text-brand flex items-center justify-center gap-1.5"
                  >
                    <TruckIcon className="h-3.5 w-3.5" />
                    {text.markDelivered}
                  </button>
                )}
                {u.status === 'delivered' && (
                  <button
                    onClick={() => updateStatus(u.id, 'distributed')}
                    className="flex-1 h-9 rounded-lg bg-brand text-white text-xs font-semibold
                               hover:bg-brand-dark transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    {text.markDistributed}
                  </button>
                )}
                {u.status === 'distributed' && (
                  <div className="flex-1 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30
                                  flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    {text.distributed_s}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
