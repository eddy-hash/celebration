export interface PendingPayment {
  id: string;
  referenceCode: string;
  status: 'pending' | 'awaiting_verification' | 'success' | 'failed' | 'expired';
  amount: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerConfirmedAt?: string;
  createdAt: string;
}

export type PaymentAction = 'verify' | 'reject';

export interface VerifyPayload {
  mixxTransactionId: string;
}

export interface RejectPayload {
  reason: string;
}
