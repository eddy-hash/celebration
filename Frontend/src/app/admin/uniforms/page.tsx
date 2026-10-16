'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { AdminButton } from '@/components/ui/AdminButton';
import { formatTsh, formatPhone, cn } from '@/lib/utils';
import {
  SparklesIcon,
  ArrowPathIcon,
  InboxIcon,
  ShoppingBagIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
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
  sizes: string[];
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl?: string;
  size?: string;
  color?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

const T = {
  sw: {
    title: 'Kitambaa',
    subtitle: 'Simamia oda na usambazaji wa kitambaa',
    catalog: 'Vitambaa Vilivyopo',
    catalogDesc: 'Bidhaa zinazopatikana',
    orders: 'Oda za Waalikwa',
    ordersDesc: 'Rekebisha ukubwa, rangi, idadi na gharama',
    empty: 'Hakuna oda bado',
    emptyDesc: 'Oda zitaonekana hapa waalikwa wanapoweka',
    price: 'Bei',
    stock: 'Stoo',
    customer: 'Mteja',
    orderNum: 'Oda',
    status: 'Hali',
    size: 'Ukubwa',
    color: 'Rangi',
    qty: 'Idadi',
    cost: 'Gharama',
    edit: 'Rekebisha',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    total: 'Jumla',
    saved: 'Imehifadhiwa!',
    statusLabels: {
      awaiting_payment: 'Inasubiri Malipo',
      paid: 'Imelipwa',
      fulfilled: 'Imekamilika',
      cancelled: 'Imefutwa',
      pending: 'Inasubiri',
    },
  },
  en: {
    title: 'Fabrics',
    subtitle: 'Manage orders and fabric distribution',
    catalog: 'Available Fabrics',
    catalogDesc: 'Products in stock',
    orders: 'Guest Orders',
    ordersDesc: 'Edit size, color, quantity, and cost',
    empty: 'No orders yet',
    emptyDesc: 'Orders will appear here when guests place them',
    price: 'Price',
    stock: 'Stock',
    customer: 'Customer',
    orderNum: 'Order',
    status: 'Status',
    size: 'Size',
    color: 'Color',
    qty: 'Qty',
    cost: 'Cost',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    total: 'Total',
    saved: 'Saved!',
    statusLabels: {
      awaiting_payment: 'Awaiting Payment',
      paid: 'Paid',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
      pending: 'Pending',
    },
  },
};

export default function UniformsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [products, setProducts] = useState<FabricProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => { load(); }, [tenantId]);

  async function load() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        api.get('/products', { params: { tenantId, limit: 100 } }),
        api.get('/orders', { params: { tenantId } }),
      ]);
      setProducts(pRes.data?.items || []);
      setOrders(oRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(s: string): 'success' | 'error' | 'warning' | 'neutral' {
    if (s === 'paid' || s === 'fulfilled') return 'success';
    if (s === 'cancelled') return 'error';
    if (s === 'awaiting_payment') return 'warning';
    return 'neutral';
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary">
            {text.title}
          </h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{text.subtitle}</p>
        </div>
        <AdminButton
          onClick={load}
          disabled={loading}
          variant="outline"
          size="icon"
          className="self-start sm:self-auto"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </AdminButton>
      </div>

      {/* ─── CATALOG ─────────────────────────────────────── */}
      {products.length > 0 && (
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base sm:text-lg text-text-primary">
                {text.catalog}
              </h2>
              <p className="text-text-muted text-xs mt-0.5">{text.catalogDesc}</p>
            </div>
            <span className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                             bg-brand/10 border border-brand/30 text-brand text-xs font-bold">
              {products.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {products.map((p) => {
              const name = lang === 'sw' ? p.nameSw : p.nameEn;
              const image = p.images?.[0] || '/fabric.jpg';
              const color = p.colors?.[0] || '';

              return (
                <div key={p.id} className="flex gap-3 p-3 rounded-2xl
                                            bg-bg-surface border border-border-subtle
                                            hover:border-brand/40 transition">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden
                                  bg-bg-elevated flex-shrink-0 flex items-center justify-center">
                    <img src={image} alt={name} className="w-full h-full object-contain p-1.5" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-text-primary font-semibold text-sm leading-tight">
                        {name}
                      </div>
                      {color && <div className="text-text-muted text-xs mt-1">{color}</div>}
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
                        <div className={cn('text-sm font-bold', p.stock > 10 ? 'text-emerald-500' : p.stock > 0 ? 'text-amber-500' : 'text-red-500')}>
                          {p.stock}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── ORDERS with editable cards ──────────────────── */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base sm:text-lg text-text-primary">
              {text.orders}
            </h2>
            <p className="text-text-muted text-xs mt-0.5">{text.ordersDesc}</p>
          </div>
          <span className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                           bg-brand/10 border border-brand/30 text-brand text-xs font-bold">
            {orders.length}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-brand/10 border border-brand/30
                            flex items-center justify-center mb-4">
              <InboxIcon className="h-8 w-8 text-brand" />
            </div>
            <h3 className="text-text-primary text-base font-semibold">{text.empty}</h3>
            <p className="text-text-muted text-xs sm:text-sm mt-1">{text.emptyDesc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                text={text}
                lang={lang}
                getStatusColor={getStatusColor}
                onSaved={load}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ORDER CARD — with editable items
   ══════════════════════════════════════════════════════════ */
function OrderCard({
  order,
  text,
  lang,
  getStatusColor,
  onSaved,
}: {
  order: Order;
  text: any;
  lang: 'sw' | 'en';
  getStatusColor: (s: string) => any;
  onSaved: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border-subtle bg-bg-surface/40 overflow-hidden"
    >
      {/* Order header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2
                      px-4 py-3 bg-bg-surface border-b border-border-subtle">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-brand/10 border border-brand/30
                          flex items-center justify-center flex-shrink-0">
            <ShoppingBagIcon className="h-4 w-4 text-brand" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-text-primary font-bold text-xs sm:text-sm truncate">
              {order.orderNumber}
            </div>
            <div className="text-text-muted text-[10px] mt-0.5">
              {new Date(order.createdAt).toLocaleDateString(
                lang === 'sw' ? 'sw-TZ' : 'en-US',
                { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge color={getStatusColor(order.status)}>
            {text.statusLabels[order.status as keyof typeof text.statusLabels] || order.status}
          </Badge>
          <div className="font-display text-brand font-bold text-base sm:text-lg">
            {formatTsh(order.total)}
          </div>
        </div>
      </div>

      {/* Customer row */}
      <div className="px-4 py-3 bg-bg-base/30 border-b border-border-subtle flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gold/20 border border-gold/40
                        flex items-center justify-center flex-shrink-0">
          <span className="text-gold text-xs font-bold">
            {order.customerName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-text-primary font-semibold text-xs sm:text-sm truncate">
            {order.customerName}
          </div>
          <div className="text-text-muted text-[10px]">{formatPhone(order.customerPhone)}</div>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-border-subtle">
        {order.items?.map((item) => (
          <EditableItemRow
            key={item.id}
            item={item}
            text={text}
            onSaved={onSaved}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   EDITABLE ITEM ROW
   ══════════════════════════════════════════════════════════ */
function EditableItemRow({
  item,
  text,
  onSaved,
}: {
  item: OrderItem;
  text: any;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    size: item.size || '',
    color: item.color || '',
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  });

  function cancel() {
    setForm({
      size: item.size || '',
      color: item.color || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
    setEditing(false);
  }

  async function save() {
    setSaving(true);
    try {
      await api.patch(`/orders/items/${item.id}`, {
        size: form.size,
        color: form.color,
        quantity: form.quantity,
        unitPrice: form.unitPrice,
      });
      setSaved(true);
      setEditing(false);
      onSaved();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const image = item.imageUrl || '/fabric.jpg';

  return (
    <div className="p-3 sm:p-4">
      <AnimatePresence mode="wait">
        {!editing ? (
          // ─── VIEW MODE ───────────────────────────────
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 items-start"
          >
            {/* Fabric image */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-bg-elevated
                            border border-border-subtle flex-shrink-0
                            flex items-center justify-center overflow-hidden">
              <img src={image} alt={item.productName} className="w-full h-full object-contain p-1" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-text-primary font-semibold text-sm leading-tight line-clamp-2">
                {item.productName}
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-text-muted">
                {item.size && (
                  <span>
                    <span className="text-text-muted">{text.size}:</span>{' '}
                    <span className="text-text-primary font-medium">{item.size}</span>
                  </span>
                )}
                {item.color && (
                  <span>
                    <span className="text-text-muted">{text.color}:</span>{' '}
                    <span className="text-text-primary font-medium">{item.color}</span>
                  </span>
                )}
                <span>
                  <span className="text-text-muted">{text.qty}:</span>{' '}
                  <span className="text-text-primary font-medium">{item.quantity}</span>
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 mt-2">
                <div className="text-brand font-bold text-sm">
                  {formatTsh(item.unitPrice)}
                </div>
                <div className="text-text-muted text-[10px]">
                  ×{item.quantity} = <span className="text-text-primary font-bold">{formatTsh(item.lineTotal)}</span>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setEditing(true)}
              className="h-9 w-9 rounded-xl border border-border-subtle bg-bg-surface
                         hover:border-brand/40 hover:bg-brand/10 hover:text-brand
                         text-text-muted transition flex items-center justify-center flex-shrink-0"
              title={text.edit}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          // ─── EDIT MODE ───────────────────────────────
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-bg-elevated border border-brand/30
                              flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={image} alt={item.productName} className="w-full h-full object-contain p-1" />
              </div>
              <div className="text-text-primary font-semibold text-sm leading-tight flex-1 min-w-0 truncate">
                {item.productName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Size */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider
                                  text-text-muted font-semibold mb-1.5">
                  {text.size}
                </label>
                <input
                  type="text"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle
                             text-text-primary text-sm focus:outline-none focus:border-brand
                             focus:ring-2 focus:ring-brand/20 transition"
                  placeholder="L / M / S"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider
                                  text-text-muted font-semibold mb-1.5">
                  {text.color}
                </label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle
                             text-text-primary text-sm focus:outline-none focus:border-brand
                             focus:ring-2 focus:ring-brand/20 transition"
                  placeholder="Black / Pink"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider
                                  text-text-muted font-semibold mb-1.5">
                  {text.qty}
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Math.max(1, Number(e.target.value) || 1) })}
                  className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle
                             text-text-primary text-sm font-mono focus:outline-none focus:border-brand
                             focus:ring-2 focus:ring-brand/20 transition"
                />
              </div>

              {/* Cost */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider
                                  text-text-muted font-semibold mb-1.5">
                  {text.cost} (TSh)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle
                             text-text-primary text-sm font-mono focus:outline-none focus:border-brand
                             focus:ring-2 focus:ring-brand/20 transition"
                />
              </div>
            </div>

            {/* Totals preview */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl
                            bg-brand/5 border border-brand/20">
              <span className="text-xs text-text-muted">{text.total}</span>
              <span className="text-brand font-bold text-sm">
                {formatTsh(form.unitPrice * form.quantity)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <AdminButton
                onClick={cancel}
                variant="outline"
                size="sm"
                icon={<XMarkIcon className="h-3.5 w-3.5" />}
                disabled={saving}
              >
                {text.cancel}
              </AdminButton>
              <AdminButton
                onClick={save}
                variant="brand"
                size="sm"
                loading={saving}
                icon={!saving ? <CheckIcon className="h-3.5 w-3.5" /> : undefined}
              >
                {saved ? text.saved : text.save}
              </AdminButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
