import { api } from '@/lib/api';
export const settingsApi = {
  getTenant: (slug: string) => api.get(`/tenants/${slug}/config`).then((r) => r.data),
};
