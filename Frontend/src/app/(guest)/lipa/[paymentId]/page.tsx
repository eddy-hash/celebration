'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { Api, type ManualPaymentInit } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { formatTsh, formatPhone, telLink, whatsappLink } from '@/lib/utils';
import {
  PhoneIcon, ClockIcon, CheckCircleIcon, XCircleIcon,
  ClipboardDocumentIcon, ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

type Status = 'pending' | 'awaiting_verification' | 'success' | 'failed' | 'expired';

const T = {
  sw: {
    celebration: 'Sherehe ya Ubatizo',
    celebrant: 'EDGAR EDSONI',
    title: 'Lipa kwa Mixx by Yas',
    instructions: 'Fuata hatua hizi kwenye simu yako:',
    referenceLabel: 'NAMBA YAKO YA KUMBUKUMBU',
    referenceNote: 'Weka namba hii kama reference',
    expiresIn: 'Muda uliobaki',
    confirmPaid: 'NIMELIPA — Thibitisha Malipo',
    awaiting: 'Tunathibitisha Malipo Yako',
    awaitingDesc: 'Asante! Tunathibitisha malipo yako. Utapata SMS mara yatakapothibitishwa.',
    awaitingTime: 'Kawaida inachukua dakika 5-15',
    success: 'Malipo Yamefanikiwa!',
    successDesc: 'Oda yako imethibitishwa.',
    failed: 'Malipo Hayakufanikiwa',
    expired: 'Muda wa Malipo Umeisha',
    tryAgain: 'Jaribu Tena',
    supportTitle: 'Namba haifanyi kazi? Wasiliana nasi:',
    viewOrder: 'Ona Oda Yangu',
    amount: 'Kiasi',
    support: 'Msaada',
  },
  en: {
    celebration: 'Baptism Celebration',
    celebrant: 'EDGAR EDSONI',
    title: 'Pay with Mixx by Yas',
    instructions: 'Follow these steps on your phone:',
    referenceLabel: 'YOUR REFERENCE NUMBER',
    referenceNote: 'Use this as reference',
    expiresIn: 'Time remaining',
    confirmPaid: "I'VE PAID — Confirm Payment",
    awaiting: 'Verifying Your Payment',
    awaitingDesc: 'Thank you! Verifying your payment. You will receive an SMS once confirmed.',
    awaitingTime: 'Usually takes 5-15 minutes',
    success: 'Payment Successful!',
    successDesc: 'Your order has been confirmed.',
    failed: 'Payment Failed',
    expired: 'Payment Expired',
    tryAgain: 'Try Again',
    supportTitle: 'Number not working? Contact us:',
    viewOrder: 'View My Order',
    amount: 'Amount',
    support: 'Support',
  },
};

export default function LipaPage() {
  const { lang } = useI18n();
  const { tenant } = useAuth();
  const router = useRouter();
  const params = useParams();
  const paymentId = params.paymentId as string;

  const [payment, setPayment] = useState<ManualPaymentInit | null>(null);
  const [status, setStatus] = useState<Status>('pending');
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [copied, setCopied] = useState(false);

  const text = T[lang];
  const wa = tenant?.whatsappNumber || '255710209220';
  const p1 = tenant?.phonePrimary || '0710209220';
  const p2 = tenant?.phoneSecondary || '0692506552';
  const businessNumber = tenant?.mixxBusinessNumber || '15714656';

  useEffect(() => {
    (async () => {
      try {
        const cached = sessionStorage.getItem('erick_payment');
        if (cached) setPayment(JSON.parse(cached));
        const s = await Api.getPaymentStatus(paymentId);
        setStatus(s.status as Status);
      } catch {}
    })();
  }, [paymentId]);

  useEffect(() => {
    if (status !== 'pending') return;
    const i = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { setStatus('expired'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, [status]);

  useEffect(() => {
    if (status !== 'awaiting_verification') return;
    const i = setInterval(async () => {
      const s = await Api.getPaymentStatus(paymentId);
      if (s.status === 'success') setStatus('success');
      if (s.status === 'failed') setStatus('failed');
    }, 4000);
    return () => clearInterval(i);
  }, [status, paymentId]);

  const handlePaid = async () => {
    await Api.confirmManualPayment(paymentId);
    setStatus('awaiting_verification');
  };

  const copyRef = () => {
    if (payment?.referenceCode) {
      navigator.clipboard.writeText(payment.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {status === 'pending' && payment && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 sm:space-y-5"
          >
            {/* Header with YAS logo */}
            <div className="text-center">
              <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white items-center justify-center mb-3 sm:mb-4 p-2 sm:p-2.5 border border-border-subtle">
                <img src="/yas.png" alt="Mixx by Yas" className="w-full h-full object-contain" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-white">{text.title}</h1>
              <p className="text-text-secondary mt-1.5 text-xs sm:text-sm">{text.instructions}</p>
            </div>

            {/* Business number callout */}
            <div className="card p-3 sm:p-4 bg-brand/5 border-brand/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">
                    {lang === 'sw' ? 'Namba ya Biashara' : 'Business Number'}
                  </div>
                  <div className="font-mono text-lg sm:text-2xl font-bold text-brand mt-0.5">
                    {businessNumber}
                  </div>
                </div>
                <img src="/yas.png" alt="YAS" className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-contain bg-white p-1" />
              </div>
            </div>

            {/* USSD Steps */}
            <div className="card p-4 sm:p-5">
              <ol className="space-y-3 sm:space-y-4">
                {payment.ussdSteps.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-brand text-text-primary font-bold text-xs sm:text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-white pt-0.5 text-xs sm:text-sm font-mono break-all">
                      {step}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Reference code */}
            <div className="card p-4 sm:p-5 bg-gradient-to-br from-brand/10 to-transparent">
              <div className="text-[10px] sm:text-xs text-text-muted tracking-wider uppercase mb-2">
                {text.referenceLabel}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-base sm:text-xl font-bold text-brand tracking-wider break-all">
                  {payment.referenceCode}
                </div>
                <button
                  onClick={copyRef}
                  className="p-2.5 rounded-xl bg-bg-surface hover:bg-brand/20 transition flex-shrink-0"
                >
                  {copied
                    ? <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                    : <ClipboardDocumentIcon className="h-5 w-5 text-white" />}
                </button>
              </div>
              <div className="text-[10px] sm:text-xs text-text-muted mt-2">{text.referenceNote}</div>
            </div>

            {/* Amount + Timer */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs text-text-muted uppercase mb-1">{text.amount}</div>
                <div className="font-display text-lg sm:text-2xl text-brand font-bold break-all">
                  {formatTsh(payment.amount)}
                </div>
              </div>
              <div className="card p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs text-text-muted uppercase mb-1">{text.expiresIn}</div>
                <div className="font-display text-lg sm:text-2xl text-text-primary font-bold flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                  {mm}:{ss}
                </div>
              </div>
            </div>

            {/* Confirm button */}
            <Button onClick={handlePaid} className="w-full h-12" size="lg">
              <CheckCircleIcon className="h-5 w-5" />
              {text.confirmPaid}
            </Button>

            {/* Support */}
            <div className="text-center text-xs sm:text-sm">
              <p className="text-text-secondary mb-2">{text.supportTitle}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={telLink(p1)} className="inline-flex items-center gap-1.5 text-text-primary hover:text-brand transition">
                  <PhoneIcon className="h-4 w-4" /> {formatPhone(p1)}
                </a>
                <a href={telLink(p2)} className="inline-flex items-center gap-1.5 text-text-primary hover:text-brand transition">
                  <PhoneIcon className="h-4 w-4" /> {formatPhone(p2)}
                </a>
                <a href={whatsappLink(wa, 'Habari, nahitaji msaada kwa malipo')} target="_blank" rel="noopener"
                   className="inline-flex items-center gap-1.5 text-text-primary hover:text-[#25D366] transition">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'awaiting_verification' && (
          <motion.div key="awaiting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-8">
            <div className="relative inline-flex mb-5">
              <div className="h-20 w-20 rounded-full border-4 border-brand/20" />
              <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-brand border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ClockIcon className="h-8 w-8 text-brand" />
              </div>
            </div>
            <h1 className="font-display text-2xl text-white">{text.awaiting}</h1>
            <p className="text-text-secondary mt-2 text-sm max-w-md mx-auto">{text.awaitingDesc}</p>

            {/* Celebrant name */}
            <div className="mt-4 inline-flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl bg-gold/10 border border-gold/30">
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold/80">
                {text.celebration}
              </span>
              <span className="font-display text-lg text-text-primary font-bold tracking-wide">
                {text.celebrant}
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-elevated border border-border-subtle text-xs text-text-secondary">
              <ClockIcon className="h-3.5 w-3.5" /> {text.awaitingTime}
            </div>
            <div className="mt-4 text-xs text-text-muted font-mono break-all">
              Ref: {payment?.referenceCode}
            </div>
            <Button onClick={() => router.push('/oda-yangu')} variant="ghost" className="mt-6">
              {text.viewOrder}
            </Button>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.15 }}
              className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500 mb-5"
            >
              <CheckCircleIcon className="h-10 w-10 text-emerald-400" />
            </motion.div>
            <h1 className="font-display text-2xl sm:text-3xl text-white">{text.success}</h1>
            <p className="text-text-secondary mt-2 text-sm">{text.successDesc}</p>

            {/* Celebrant name */}
            <div className="mt-5 inline-flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-gold/10 border border-gold/30">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold/80">
                {text.celebration}
              </span>
              <span className="font-display text-xl sm:text-2xl text-text-primary font-bold tracking-wide">
                {text.celebrant}
              </span>
            </div>
            <Button onClick={() => router.push('/oda-yangu')} className="mt-6" size="lg">
              {text.viewOrder}
            </Button>
          </motion.div>
        )}

        {(status === 'failed' || status === 'expired') && (
          <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500 mb-5">
              {status === 'expired'
                ? <ExclamationTriangleIcon className="h-10 w-10 text-red-400" />
                : <XCircleIcon className="h-10 w-10 text-red-400" />}
            </div>
            <h1 className="font-display text-2xl text-white">
              {status === 'failed' ? text.failed : text.expired}
            </h1>
            <Button onClick={() => router.push('/checkout')} className="mt-6">
              {text.tryAgain}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
