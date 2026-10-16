'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatTsh, formatPhone } from '@/lib/utils';
import {
  CreditCardIcon, ArrowPathIcon, InboxIcon,
  CheckCircleIcon, XCircleIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

const T = {
  sw: {
    title: 'Malipo', subtitle: 'Thibitisha malipo ya Lipa kwa Mixx by Yas',
    empty: 'Hakuna malipo yanayosubiri', emptyDesc: 'Malipo yataonekana hapa',
    verify: 'Thibitisha', reject: 'Kataa',
    txId: 'Namba ya Muamala', txIdPlaceholder: 'MP123456789',
    reason: 'Sababu ya kukataa', reasonPlaceholder: 'Mteja hakulipa...',
    confirm: 'Thibitisha', cancel: 'Ghairi',
    awaiting: 'Inasubiri', pending: 'Inasubiri',
  },
  en: {
    title: 'Payments', subtitle: 'Verify Lipa kwa Mixx by Yas payments',
    empty: 'No pending payments', emptyDesc: 'Payments will appear here',
    verify: 'Verify', reject: 'Reject',
    txId: 'Transaction ID', txIdPlaceholder: 'MP123456789',
    reason: 'Rejection reason', reasonPlaceholder: 'Customer did not pay...',
    confirm: 'Confirm', cancel: 'Cancel',
    awaiting: 'Awaiting', pending: 'Pending',
  },
};

export default function PaymentsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ id: string; action: 'verify' | 'reject' } | null>(null);
  const [txId, setTxId] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => { load(); }, [tenantId]);

  async function load() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await api.get('/payments/manual/pending', { params: { tenantId } });
      setPayments(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function doAction() {
    if (!modal) return;
    setBusy(true);
    try {
      if (modal.action === 'verify') {
        await api.post(`/payments/manual/${modal.id}/verify`, { mixxTransactionId: txId });
      } else {
        await api.post(`/payments/manual/${modal.id}/reject`, { reason });
      }
      setModal(null); setTxId(''); setReason('');
      await load();
    } catch (e) { console.error(e); }
    finally { setBusy(false); }
  }

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

      {loading ? (
        <div className="card p-12 text-center">
          <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : payments.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <InboxIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-white text-base sm:text-lg font-semibold">{text.empty}</h3>
          <p className="text-text-muted text-xs sm:text-sm mt-1">{text.emptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {payments.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }} className="card p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <CreditCardIcon className="h-4 w-4 text-brand flex-shrink-0" />
                  <span className="font-mono text-text-primary font-semibold text-xs sm:text-sm truncate">
                    {p.referenceCode}
                  </span>
                  <Badge color="warning">
                    {p.status === 'awaiting_verification' ? text.awaiting : text.pending}
                  </Badge>
                </div>
                <div className="font-display text-base sm:text-lg font-bold text-brand flex-shrink-0">
                  {formatTsh(p.amount)}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-text-secondary truncate">
                {p.customerName} · {formatPhone(p.customerPhone)}
              </div>
              <div className="text-[10px] sm:text-xs text-text-muted mt-1">
                {new Date(p.customerConfirmedAt || p.createdAt).toLocaleString(
                  lang === 'sw' ? 'sw-TZ' : 'en-US',
                  { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setModal({ id: p.id, action: 'verify' })}
                  className="flex-1 h-9 rounded-lg bg-brand text-text-primary text-xs font-semibold
                             hover:bg-brand-dark transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  {text.verify}
                </button>
                <button
                  onClick={() => setModal({ id: p.id, action: 'reject' })}
                  className="h-9 px-3 rounded-lg bg-bg-surface hover:bg-red-500/20 transition
                             flex items-center justify-center gap-1.5 text-red-400 text-xs font-semibold"
                >
                  <XCircleIcon className="h-3.5 w-3.5" />
                  {text.reject}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setModal(null); setTxId(''); setReason(''); }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
                         sm:w-full sm:max-w-md bg-bg-elevated rounded-2xl border border-border-subtle p-5 z-50"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg text-white">
                  {modal.action === 'verify' ? text.verify : text.reject}
                </h2>
                <button
                  onClick={() => { setModal(null); setTxId(''); setReason(''); }}
                  className="p-2 -mr-2 rounded-lg hover:bg-bg-surface"
                >
                  <XMarkIcon className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="space-y-4">
                {modal.action === 'verify' ? (
                  <Input
                    label={text.txId}
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder={text.txIdPlaceholder}
                    autoFocus
                  />
                ) : (
                  <Input
                    label={text.reason}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={text.reasonPlaceholder}
                    autoFocus
                  />
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { setModal(null); setTxId(''); setReason(''); }}
                    className="flex-1 h-11 rounded-xl border border-border-subtle text-text-primary font-medium text-sm
                               hover:bg-bg-surface transition"
                  >
                    {text.cancel}
                  </button>
                  <button
                    onClick={doAction}
                    disabled={busy || (modal.action === 'verify' ? !txId.trim() : !reason.trim())}
                    className="flex-1 h-11 rounded-xl bg-brand text-text-primary font-semibold text-sm
                               hover:bg-brand-dark disabled:opacity-50 transition
                               flex items-center justify-center"
                  >
                    {busy
                      ? <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : text.confirm}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
