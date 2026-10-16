import { api } from '@/lib/api';
import type { FabricProduct, Order, Uniform, UniformStats } from '../types';

export const uniformsApi = {
  list: async (tenantId: string): Promise<Uniform[]> => {
    const r = await api.get(`/uniforms/tenant/${tenantId}`); return r.data || [];
  },
  stats: async (tenantId: string): Promise<UniformStats> => {
    const r = await api.get(`/uniforms/tenant/${tenantId}/stats`); return r.data;
  },
  update: (id: string, status: string) => api.patch(`/uniforms/${id}`, { status }),
  getProducts: async (tenantId: string): Promise<FabricProduct[]> => {
    const r = await api.get('/products', { params: { tenantId, limit: 100 } });
    return r.data?.items || [];
  },
  getOrders: async (tenantId: string): Promise<Order[]> => {
    const r = await api.get('/orders', { params: { tenantId } });
    return r.data || [];
  },
  updateOrderItem: (itemId: string, payload: { size?: string; color?: string; quantity?: number; unitPrice?: number }) =>
    api.patch(`/orders/items/${itemId}`, payload),
};
