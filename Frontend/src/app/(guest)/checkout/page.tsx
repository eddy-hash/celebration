'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth, useCart } from '@/lib/store';
import { Api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatTsh, cn, normalizePhone } from '@/lib/utils';
import { CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const T = {
  sw: {
    celebration: 'Sherehe ya Ubatizo',
    celebrant: 'EDGAR EDSONI',
    title: 'Kamilisha Oda',
    info: 'Taarifa Zako',
    name: 'Jina Kamili',
    phone: 'Namba ya Simu',
    region: 'Mkoa',
    address: 'Anwani',
    notes: 'Maelezo ya Ziada',
    payment: 'Njia ya Malipo',
    payWithMixx: 'Lipa kwa Mixx by Yas',
    payWithMixxDesc: 'Lipa kwa urahisi kwa kutumia Mixx by Yas',
    businessNumber: 'Namba ya Biashara',
    recommended: 'INAPENDEKEZWA',
    placeOrder: 'Weka Oda',
    orderSummary: 'Muhtasari wa Oda',
    subtotal: 'Jumla Ndogo',
    shipping: 'Usafirishaji',
    free: 'Bure',
    total: 'Jumla',
    errorNamePhone: 'Jaza jina na namba ya simu',
    errorInvalidPhone: 'Namba ya simu si sahihi',
    errorGeneral: 'Hitilafu imetokea. Jaribu tena.',
    secure: 'Malipo Salama',
  },
  en: {
    celebration: 'Baptism Celebration',
    celebrant: 'EDGAR EDSONI',
    title: 'Complete Order',
    info: 'Your Information',
    name: 'Full Name',
    phone: 'Phone Number',
    region: 'Region',
    address: 'Address',
    notes: 'Additional Notes',
    payment: 'Payment Method',
    payWithMixx: 'Pay with Mixx by Yas',
    payWithMixxDesc: 'Easy payment via Mixx by Yas',
    businessNumber: 'Business Number',
    recommended: 'RECOMMENDED',
    placeOrder: 'Place Order',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    errorNamePhone: 'Fill name and phone',
    errorInvalidPhone: 'Invalid phone number',
    errorGeneral: 'An error occurred. Try again.',
    secure: 'Secure Payment',
  },
};

export default function CheckoutPage() {
  const { lang } = useI18n();
  const { user, tenant, isLoggedIn } = useAuth();
  const { items, total, clear } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const text = T[lang];
  const businessNumber = tenant?.mixxBusinessNumber || '15714656';

  useEffect(() => {
    if (!isLoggedIn()) router.push('/ingia');
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
    if (items.length === 0) router.push('/kikapu');
  }, [router, isLoggedIn, user, items.length]);

  const subtotal = total();

  const handleSubmit = async () => {
    if (!name || !phone) { setError(text.errorNamePhone); return; }
    const p = normalizePhone(phone);
    if (!p) { setError(text.errorInvalidPhone); return; }

    setLoading(true);
    setError('');
    try {
      const order = await Api.createOrder({
        tenantId: user!.tenantId,
        customerName: name,
        customerPhone: p,
        deliveryAddress: address,
        region,
        notes,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          size: it.size,
          color: it.color,
        })),
      });

      const payment = await Api.initManualPayment({
        orderId: order.id,
        customerPhone: p,
        customerName: name,
      });

      sessionStorage.setItem('erick_payment', JSON.stringify(payment));

      clear();
      router.push(`/lipa/${payment.paymentId}`);
    } catch (e: any) {
      setError(e.response?.data?.message || text.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="px-0.5">
        <p className="eyebrow">{lang === 'sw' ? 'Maliza' : 'Finish'}</p>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary mt-1.5">
          {text.title}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Contact info */}
          <div className="card p-4 sm:p-5">
            <h3 className="font-display text-base sm:text-lg text-text-primary mb-4">{text.info}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label={text.name} value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label={text.phone} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" required />
              <Input label={text.region} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Dar es Salaam" />
              <Input label={text.address} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Mtaa, Kijiji" />
            </div>
            <div className="mt-3">
              <Input label={text.notes} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="..." />
            </div>
          </div>

          {/* Payment method — with YAS logo */}
          <div className="card p-4 sm:p-5">
            <h3 className="font-display text-base sm:text-lg text-text-primary mb-4">{text.payment}</h3>

            <div className="relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 border-brand bg-brand/5">
              {/* YAS logo */}
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5">
                <img
                  src="/yas.png"
                  alt="Mixx by Yas"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold text-sm sm:text-base">
                    {text.payWithMixx}
                  </span>
                  <Badge color="brand" className="text-[10px]">{text.recommended}</Badge>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm mt-1">
                  {text.payWithMixxDesc}
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">
                    {text.businessNumber}:
                  </span>
                  <span className="font-mono text-brand font-bold text-sm sm:text-base">
                    {businessNumber}
                  </span>
                </div>
              </div>

              <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand flex-shrink-0 mt-1" />
            </div>

            {/* Secure badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-text-muted text-xs">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
              <span>{text.secure} · SSL</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs sm:text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-24 h-fit card p-4 sm:p-5"
        >
          <div className="mb-4 pb-4 border-b border-border-subtle">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold/80 mb-1">
              {text.celebration}
            </div>
            <div className="font-display text-base sm:text-lg text-text-primary font-bold tracking-wide">
              {text.celebrant}
            </div>
          </div>
          <h3 className="font-display text-base sm:text-lg text-text-primary mb-4">{text.orderSummary}</h3>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {items.map((it, i) => (
              <div key={i} className="flex justify-between gap-3 text-xs sm:text-sm">
                <div className="min-w-0">
                  <div className="text-white truncate">{it.name}</div>
                  <div className="text-text-muted text-[10px] sm:text-xs">
                    {it.size} {it.color && `· ${it.color}`} × {it.quantity}
                  </div>
                </div>
                <span className="text-text-secondary flex-shrink-0">
                  {formatTsh(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border-subtle mt-4 pt-3 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>{text.subtotal}</span>
              <span>{formatTsh(subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>{text.shipping}</span>
              <span className="text-emerald-400">{text.free}</span>
            </div>
            <div className="flex justify-between text-text-primary font-bold text-base pt-1 border-t border-border-subtle">
              <span>{text.total}</span>
              <span className="text-brand">{formatTsh(subtotal)}</span>
            </div>
          </div>

          <Button onClick={handleSubmit} loading={loading} className="w-full mt-4 h-12" size="lg">
            {text.placeOrder}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
