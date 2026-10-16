'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/store';
import { paymentsApi } from '../api/paymentsApi';
import type { PendingPayment, VerifyPayload, RejectPayload } from '../types';

export function usePayments() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';

  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await paymentsApi.getPending(tenantId);
      setPayments(data);
    } catch (e) {
      console.error('Failed to load payments:', e);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  const verify = useCallback(
    async (paymentId: string, payload: VerifyPayload) => {
      setBusy(true);
      try {
        await paymentsApi.verify(paymentId, payload);
        await load();
      } finally {
        setBusy(false);
      }
    },
    [load],
  );

  const reject = useCallback(
    async (paymentId: string, payload: RejectPayload) => {
      setBusy(true);
      try {
        await paymentsApi.reject(paymentId, payload);
        await load();
      } finally {
        setBusy(false);
      }
    },
    [load],
  );

  return {
    payments,
    loading,
    busy,
    refresh: load,
    verify,
    reject,
  };
}
