'use client';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { PageHeader } from '@/components/primitives/PageHeader';
import { EmptyState } from '@/components/primitives/EmptyState';
import { LoadingState } from '@/components/primitives/LoadingState';
import { AdminButton } from '@/components/ui/AdminButton';
import { ArrowPathIcon, InboxIcon } from '@heroicons/react/24/outline';
import { usePayments } from '../hooks/usePayments';
import { PaymentCard } from './PaymentCard';
import { VerifyModal } from './VerifyModal';
import { PAYMENTS_I18N } from '../constants';
import type { PaymentAction } from '../types';

export function AdminPaymentsPage() {
  const { lang } = useI18n();
  const text = PAYMENTS_I18N[lang];
  const { payments, loading, busy, refresh, verify, reject } = usePayments();

  const [modal, setModal] = useState<{ id: string; action: PaymentAction } | null>(null);

  function openModal(id: string, action: PaymentAction) {
    setModal({ id, action });
  }

  function closeModal() {
    setModal(null);
  }

  async function handleSubmit(payload: { txId?: string; reason?: string }) {
    if (!modal) return;
    if (modal.action === 'verify') {
      await verify(modal.id, { mixxTransactionId: payload.txId || '' });
    } else {
      await reject(modal.id, { reason: payload.reason || '' });
    }
    closeModal();
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={text.title}
        subtitle={text.subtitle}
        action={
          <AdminButton
            onClick={refresh}
            disabled={loading}
            variant="outline"
            size="icon"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </AdminButton>
        }
      />

      {loading ? (
        <LoadingState />
      ) : payments.length === 0 ? (
        <EmptyState icon={InboxIcon} title={text.empty} description={text.emptyDesc} />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {payments.map((p, i) => (
            <PaymentCard
              key={p.id}
              payment={p}
              index={i}
              text={text}
              lang={lang}
              onAction={openModal}
            />
          ))}
        </div>
      )}

      <VerifyModal
        isOpen={!!modal}
        action={modal?.action ?? 'verify'}
        text={text}
        busy={busy}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
