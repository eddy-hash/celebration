'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { AdminApi, api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { AdminButton } from '@/components/ui/AdminButton';
import { formatTsh, formatPhone, cn } from '@/lib/utils';
import {
  UsersIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  SparklesIcon,
  ArrowPathIcon,
  BanknotesIcon,
  InboxIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface FabricProduct {
  id: string;
  sku: string;
  nameSw: string;
  nameEn: string;
  price: number;
  images: string[];
  stock: number;
  colors: string[];
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  total: number;
  items: any[];
  createdAt: string;
}

const T = {
  sw: {
    eyebrow: 'Dashibodi',
    welcome: 'Karibu',
    subtitle: 'Muhtasari wa sherehe',
    refresh: 'Sasisha',
    kpiInvited: 'Walioalikwa',
    kpiConfirmed: 'Wageni Wamekubali',
    kpiOrders: 'Oda Zote',
    kpiRevenue: 'Mapato',
    confirmedCount: 'wamekubali',
    pendingCount: 'wanasubiri',
    paidCount: 'zimelipwa',
    paymentsCount: 'malipo',
    catalogTitle: 'Vitambaa Vyetu',
    catalogDesc: 'Bidhaa zinazopatikana kwa waalikwa',
    price: 'Bei',
    stock: 'Stoo',
    recentOrders: 'Oda za Karibuni',
    recentOrdersDesc: 'Oda zilizowekwa na waalikwa',
    recentInvites: 'Waalikwa wa Karibuni',
    pendingPaymentsTitle: 'Malipo yanasubiri uthubitisho',
    pendingPaymentsDesc: 'Una malipo {{count}} yanayohitaji uthibitisho',
    noInvites: 'Hakuna waalikwa bado',
    noOrders: 'Hakuna oda bado',
    items: 'bidhaa',
    statusLabels: {
      awaiting_payment: 'Inasubiri Malipo',
      paid: 'Imelipwa',
      fulfilled: 'Imekamilika',
      cancelled: 'Imefutwa',
      pending: 'Inasubiri',
      confirmed: 'Wamekubali',
      declined: 'Wamekataa',
    },
  },
  en: {
    eyebrow: 'Dashboard',
    welcome: 'Welcome',
    subtitle: 'Celebration overview',
    refresh: 'Refresh',
    kpiInvited: 'Invited',
    kpiConfirmed: 'Confirmed Guests',
    kpiOrders: 'Total Orders',
    kpiRevenue: 'Revenue',
    confirmedCount: 'confirmed',
    pendingCount: 'pending',
    paidCount: 'paid',
    paymentsCount: 'payments',
    catalogTitle: 'Our Fabrics',
    catalogDesc: 'Products available to invited guests',
    price: 'Price',
    stock: 'Stock',
    recentOrders: 'Recent Orders',
    recentOrdersDesc: 'Orders placed by invited guests',
    recentInvites: 'Recent Invites',
    pendingPaymentsTitle: 'Payments awaiting verification',
    pendingPaymentsDesc: 'You have {{count}} payments needing verification',
    noInvites: 'No invites yet',
    noOrders: 'No orders yet',
    items: 'items',
    statusLabels: {
      awaiting_payment: 'Awaiting Payment',
      paid: 'Paid',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
      pending: 'Pending',
      confirmed: 'Confirmed',
      declined: 'Declined',
    },
  },
};

export default function AdminDashboard() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [products, setProducts] = useState<FabricProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => {
    if (!tenantId) return;
    load();
  }, [tenantId]);

  async function load() {
    setRefreshing(true);
    try {
      const [analytics, productsRes, ordersRes] = await Promise.all([
        AdminApi.analytics(tenantId),
        api.get('/products', { params: { tenantId, limit: 100 } }),
        api.get('/orders', { params: { tenantId } }),
      ]);
      setData(analytics);
      setProducts(productsRes.data?.items || []);
      setRecentOrders((ordersRes.data || []).slice(0, 4));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function getStatusColor(s: string): 'success' | 'error' | 'warning' | 'neutral' {
    if (s === 'paid' || s === 'fulfilled' || s === 'confirmed') return 'success';
    if (s === 'cancelled' || s === 'declined') return 'error';
    if (s === 'awaiting_payment' || s === 'pending') return 'warning';
    return 'neutral';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      Icon: UsersIcon,
      label: text.kpiInvited,
      value: data?.invitations?.total || 0,
      sub: `${data?.invitations?.confirmed || 0} ${text.confirmedCount}`,
      color: 'brand' as const,
    },
    {
      Icon: SparklesIcon,
      label: text.kpiConfirmed,
      value: data?.invitations?.confirmedGuests || 0,
      sub: `${data?.invitations?.pending || 0} ${text.pendingCount}`,
      color: 'gold' as const,
    },
    {
      Icon: ShoppingBagIcon,
      label: text.kpiOrders,
      value: data?.orders?.total || 0,
      sub: `${data?.orders?.paid || 0} ${text.paidCount}`,
      color: 'brand' as const,
    },
    {
      Icon: BanknotesIcon,
      label: text.kpiRevenue,
      value: formatTsh(data?.orders?.revenue || 0),
      sub: `${data?.payments?.successful || 0} ${text.paymentsCount}`,
      color: 'success' as const,
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ─── Header ─────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary mt-1">
            {text.welcome}
          </h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{text.subtitle}</p>
        </div>
        <AdminButton
          onClick={load}
          disabled={refreshing}
          variant="outline"
          size="icon"
          className="self-start sm:self-auto"
        >
          <ArrowPathIcon className={cn('h-4 w-4', refreshing && 'animate-spin')} />
        </AdminButton>
      </div>

      {/* ─── KPI Cards ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s, i) => {
          const Icon = s.Icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-3 sm:p-4 lg:p-5"
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand/10 border border-brand/30
                                flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-brand" />
                </div>
                <Badge color={s.color} className="text-[9px] sm:text-[10px]">{s.sub}</Badge>
              </div>
              <div className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary break-all">
                {s.value}
              </div>
              <div className="text-[10px] sm:text-xs text-text-muted mt-1">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Pending Payments Alert ─────────────── */}
      {data?.payments?.pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 border-amber-500/40 bg-amber-500/5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40
                            flex items-center justify-center flex-shrink-0">
              <CreditCardIcon className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-text-primary font-semibold text-sm">
                {text.pendingPaymentsTitle}
              </div>
              <div className="text-amber-400 text-xs mt-0.5">
                {text.pendingPaymentsDesc.replace('{{count}}', String(data.payments.pending))}
              </div>
            </div>
            <AdminButton
              onClick={() => (window.location.href = '/admin/payments')}
              variant="warning"
              size="sm"
            >
              {lang === 'sw' ? 'Thibitisha' : 'Verify'}
            </AdminButton>
          </div>
        </motion.div>
      )}

      {/* ─── Fabric Catalog ─────────────────────── */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base sm:text-lg text-text-primary">
                {text.catalogTitle}
              </h2>
              <p className="text-text-muted text-xs mt-0.5">{text.catalogDesc}</p>
            </div>
            <Badge color="brand">{products.length}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((p) => {
              const name = lang === 'sw' ? p.nameSw : p.nameEn;
              const image = p.images?.[0] || '/fabric.jpg';
              const color = p.colors?.[0] || '';

              return (
                <div
                  key={p.id}
                  className="flex gap-3 p-3 rounded-2xl bg-bg-surface border border-border-subtle
                             hover:border-brand/40 transition"
                >
                  {/* Image */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden
                                  bg-bg-elevated flex-shrink-0
                                  flex items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <PhotoIcon className="h-8 w-8 text-text-muted" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-text-primary font-semibold text-sm leading-tight">
                        {name}
                      </div>
                      {color && (
                        <div className="text-text-muted text-xs mt-1">{color}</div>
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-2 mt-2">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-text-muted">
                          {text.price}
                        </div>
                        <div className="text-brand font-bold text-base sm:text-lg">
                          {formatTsh(p.price)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted">
                          {text.stock}
                        </div>
                        <div
                          className={cn(
                            'text-sm font-bold',
                            p.stock > 10 ? 'text-emerald-500' :
                            p.stock > 0 ? 'text-amber-500' : 'text-red-500',
                          )}
                        >
                          {p.stock}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ─── Recent Orders ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 sm:p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base sm:text-lg text-text-primary">
              {text.recentOrders}
            </h2>
            <p className="text-text-muted text-xs mt-0.5">{text.recentOrdersDesc}</p>
          </div>
          <Badge color="brand">{recentOrders.length}</Badge>
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((o) => {
              const itemCount = o.items?.length || 0;
              const firstItem = o.items?.[0];

              return (
                <div
                  key={o.id}
                  className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl
                             bg-bg-surface border border-border-subtle
                             hover:border-brand/40 transition"
                >
                  {/* Fabric preview */}
                  <div className="h-14 w-14 rounded-xl bg-bg-elevated border border-border-subtle
                                  flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={firstItem?.imageUrl || '/fabric.jpg'}
                      alt={firstItem?.productName || 'Fabric'}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0">
                        <div className="font-mono text-text-primary font-bold text-xs sm:text-sm">
                          {o.orderNumber}
                        </div>
                        <div className="text-text-muted text-[11px] mt-0.5 truncate">
                          {o.customerName} · {itemCount} {text.items}
                        </div>
                      </div>
                      <Badge color={getStatusColor(o.status)}>
                        {text.statusLabels[o.status as keyof typeof text.statusLabels] || o.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="font-display text-base sm:text-lg font-bold text-brand
                                  flex-shrink-0 self-start sm:self-center">
                    {formatTsh(o.total)}
                  </div>
                </div>
              );
            })}

            <AdminButton
              onClick={() => (window.location.href = '/admin/orders')}
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              {lang === 'sw' ? 'Ona Oda Zote' : 'View All Orders'}
            </AdminButton>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-brand/10 border border-brand/30
                            flex items-center justify-center mb-3">
              <InboxIcon className="h-7 w-7 text-brand" />
            </div>
            <div className="text-text-muted text-xs sm:text-sm">{text.noOrders}</div>
          </div>
        )}
      </motion.div>

      {/* ─── Recent Invites ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 sm:p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base sm:text-lg text-text-primary">
            {text.recentInvites}
          </h2>
          <Badge color="brand">{data?.recent?.invites?.length || 0}</Badge>
        </div>

        {data?.recent?.invites?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.recent.invites.map((inv: any) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-bg-surface"
              >
                <div className="min-w-0">
                  <div className="text-text-primary text-xs sm:text-sm font-medium truncate">
                    {inv.guestName}
                  </div>
                  <div className="text-text-muted text-[10px] sm:text-xs">
                    {formatPhone(inv.guestPhone)}
                  </div>
                </div>
                <Badge color={getStatusColor(inv.status)}>
                  {text.statusLabels[inv.status as keyof typeof text.statusLabels] || inv.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-text-muted text-xs">{text.noInvites}</div>
        )}
      </motion.div>
    </div>
  );
}
