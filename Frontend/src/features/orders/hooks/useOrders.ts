'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/store';
import { ordersApi } from '../api/ordersApi';
import type { Order } from '../types';
export function useOrders(filter: string = 'all') {
  const { user } = useAuth();
  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const [orders, setOrders] = useState<Order[]>([]); const [loading, setLoading] = useState(true); const [busyId, setBusyId] = useState<string | null>(null);
  const load = useCallback(async () => { if (!tenantId) return; setLoading(true); try { setOrders(await ordersApi.list(tenantId, filter)); } catch (e) { console.error(e); } finally { setLoading(false); } }, [tenantId, filter]);
  useEffect(() => { load(); }, [load]);
  const fulfill = useCallback(async (id: string) => { setBusyId(id); try { await ordersApi.fulfill(id); await load(); } finally { setBusyId(null); } }, [load]);
  return { orders, loading, busyId, refresh: load, fulfill };
}
