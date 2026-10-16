import { api } from '@/lib/api';
import type { AuditLog } from '../types';
export const auditApi = {
  list: async (params: { tenantId: string; action?: string; from?: string; search?: string; limit?: number }) => {
    const r = await api.get('/audit', { params }); return { items: r.data.items || [], total: r.data.total || 0 };
  },
  stats: async (tenantId: string) => { const r = await api.get('/audit/stats', { params: { tenantId } }); return r.data; },
};
