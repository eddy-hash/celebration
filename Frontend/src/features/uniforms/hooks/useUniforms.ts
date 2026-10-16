'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/store';
import { uniformsApi } from '../api/uniformsApi';
import type { FabricProduct, Order, Uniform, UniformStats } from '../types';

export function useUniforms() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';

  const [products, setProducts] = useState<FabricProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const [p, o] = await Promise.all([
        uniformsApi.getProducts(tenantId),
        uniformsApi.getOrders(tenantId),
      ]);
      setProducts(p);
      setOrders(o);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { load(); }, [load]);

  return {
    products,
    orders,
    loading,
    refresh: load,
  };
}
