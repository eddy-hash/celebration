import { api } from '@/lib/api';
import type { Order } from '../types';
export const ordersApi = {
  list: async (tenantId: string, status?: string): Promise<Order[]> => {
    const params: any = { tenantId }; if (status && status !== 'all') params.status = status === 'awaiting' ? 'awaiting_payment' : status;
    const res = await api.get('/orders', { params }); return res.data || [];
  },
  fulfill: (id: string) => api.patch(`/orders/${id}/fulfill`),
  updateItem: (itemId: string, payload: any) => api.patch(`/orders/items/${itemId}`, payload),
};
