'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatTsh } from '@/lib/utils';
import { ShoppingBagIcon, InboxIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

export default function MyOrderPage() {
  const { t } = useI18n();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) router.push('/ingia');
  }, [router, isLoggedIn]);

  useEffect(() => {
    if (!user?.tenantId) return;
    (async () => {
      try {
        const res = await api.get('/orders', { params: { tenantId: user.tenantId } });
        const mine = (res.data || []).filter((o: any) => o.customerPhone === user.phone);
        setOrders(mine);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <>
      
      <main className="min-h-screen py-8 lg:py-12">
        <Container>
          <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gold/80 mb-1">
          Sherehe ya Ubatizo
        </div>
        <div className="font-display text-lg text-text-primary font-bold tracking-wide mb-4">
          EDGAR EDSONI
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">{t('order.title')}</h1>
      </div>

          {loading ? (
            <div className="text-text-secondary">{t('common.loading')}</div>
          ) : orders.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 lg:py-20">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-4">
                <InboxIcon className="h-10 w-10 text-brand" />
              </div>
              <h3 className="font-display text-xl lg:text-2xl text-white">{t('order.empty')}</h3>
              <p className="text-text-secondary mt-2 text-sm">{t('order.emptyDesc')}</p>
              <Link href="/kitambaa" className="btn-primary mt-6 inline-flex">
                <ShoppingBagIcon className="h-5 w-5" />
                {t('cart.browse')}
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((o, i) => (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-4 lg:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-text-primary font-bold text-sm lg:text-base">#{o.orderNumber}</span>
                        <Badge color={o.status === 'paid' ? 'success' : o.status === 'fulfilled' ? 'brand' : 'warning'}>
                          {t(`order.status.${o.status}`) || o.status}
                        </Badge>
                      </div>
                      <div className="text-text-muted text-xs mt-2">
                        {t('order.placedOn')}: {new Date(o.createdAt).toLocaleString('sw-TZ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-brand font-bold text-lg lg:text-xl">{formatTsh(o.total)}</div>
                      <div className="text-text-muted text-xs">{o.items?.length || 0} items</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-subtle flex flex-wrap gap-2">
                    {o.items?.map((it: any) => (
                      <div key={it.id} className="text-xs lg:text-sm text-text-secondary">
                        {it.productName} {it.size && `· ${it.size}`} × {it.quantity}
                      </div>
                    ))}
                  </div>
                  {o.status === 'awaiting_payment' && (
                    <Button onClick={() => router.push('/checkout')} size="sm" className="mt-4">
                      {t('order.payNow')}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </main>
      
    </>
  );
}
