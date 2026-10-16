'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/store';
import { auditApi } from '../api/auditApi';
import type { AuditLog } from '../types';
type Range = 'today' | '7d' | '30d' | 'all';
function computeFrom(range: Range): Date | null { const d = new Date(); if (range === 'today') { d.setHours(0,0,0,0); return d; } if (range === '7d') { d.setDate(d.getDate() - 7); return d; } if (range === '30d') { d.setDate(d.getDate() - 30); return d; } return null; }
export function useAuditLogs(actionFilter: string, rangeFilter: Range) {
  const { user } = useAuth();
  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const [logs, setLogs] = useState<AuditLog[]>([]); const [stats, setStats] = useState<any>(null); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { if (!tenantId) return; setLoading(true); try { const from = computeFrom(rangeFilter); const [l, s] = await Promise.all([auditApi.list({ tenantId, action: actionFilter || undefined, from: from?.toISOString(), limit: 100 }), auditApi.stats(tenantId)]); setLogs(l.items); setStats(s); } catch (e) { console.error(e); } finally { setLoading(false); } }, [tenantId, actionFilter, rangeFilter]);
  useEffect(() => { load(); }, [load]);
  return { logs, stats, loading, refresh: load };
}
