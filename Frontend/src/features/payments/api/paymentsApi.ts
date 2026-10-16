import { api } from '@/lib/api';
import type { PendingPayment, VerifyPayload, RejectPayload } from '../types';

export const paymentsApi = {
  /** Fetch pending + awaiting-verification payments for a tenant */
  getPending: async (tenantId: string): Promise<PendingPayment[]> => {
    const res = await api.get('/payments/manual/pending', { params: { tenantId } });
    return res.data || [];
  },

  /** Admin verifies a payment with transaction ID */
  verify: async (paymentId: string, payload: VerifyPayload): Promise<void> => {
    await api.post(`/payments/manual/${paymentId}/verify`, payload);
  },

  /** Admin rejects a payment with reason */
  reject: async (paymentId: string, payload: RejectPayload): Promise<void> => {
    await api.post(`/payments/manual/${paymentId}/reject`, payload);
  },
};
