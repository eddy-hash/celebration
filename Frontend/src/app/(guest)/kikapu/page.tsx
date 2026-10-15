'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth, useCart } from '@/lib/store';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { formatTsh } from '@/lib/utils';
import { TrashIcon, ShoppingBagIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { t } = useI18n();
  const { isLoggedIn } = useAuth();
  const { items, remove, total } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.push('/ingia');
  }, [router, isLoggedIn]);

  const subtotal = total();

  return (
    <>
      
      <main className="min-h-screen py-8 lg:py-12">
        <Container>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-8 lg:mb-10">
            {t('cart.title')}
          </h1>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 lg:py-20">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-4">
                <ShoppingBagIcon className="h-10 w-10 text-brand" />
              </div>
              <h3 className="font-display text-xl lg:text-2xl text-white">{t('cart.empty')}</h3>
              <p className="text-text-secondary mt-2 text-sm">{t('cart.emptyDesc')}</p>
              <Link href="/kitambaa" className="btn-primary mt-6 inline-flex">
                <ShoppingBagIcon className="h-5 w-5" />
                {t('cart.browse')}
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3 lg:space-y-4">
                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="card p-3 lg:p-4 flex gap-3 lg:gap-4"
                    >
                      <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-xl bg-bg-surface flex items-center justify-center flex-shrink-0">
                        <PhotoIcon className="h-8 w-8 text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate text-sm lg:text-base">{item.name}</div>
                        <div className="text-text-muted text-xs lg:text-sm mt-1">
                          {item.size && <>Size: {item.size}</>}
                          {item.size && item.color && ' · '}
                          {item.color && <>Rangi: {item.color}</>}
                        </div>
                        <div className="mt-2 lg:mt-3 flex items-center justify-between gap-2">
                          <span className="text-brand font-bold text-sm lg:text-base">{formatTsh(item.price)}</span>
                          <span className="text-text-secondary text-xs lg:text-sm">× {item.quantity}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(i)}
                        className="self-start p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition"
                        aria-label={t('cart.remove')}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary — stacks below on mobile, sticky on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:sticky lg:top-24 h-fit card p-5 lg:p-6"
              >
                <h3 className="font-display text-xl lg:text-2xl text-white mb-5 lg:mb-6">{t('checkout.orderSummary')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatTsh(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>{t('cart.shipping')}</span>
                    <span className="text-emerald-400">Bure</span>
                  </div>
                  <div className="border-t border-border-subtle pt-3 flex justify-between text-white font-bold text-base lg:text-lg">
                    <span>{t('cart.total')}</span>
                    <span className="text-brand">{formatTsh(subtotal)}</span>
                  </div>
                </div>
                <Button onClick={() => router.push('/checkout')} className="w-full mt-5 lg:mt-6" size="lg">
                  {t('cart.checkout')}
                </Button>
                <Link href="/kitambaa" className="block text-center text-sm text-text-secondary hover:text-white mt-4">
                  {t('cart.continue')}
                </Link>
              </motion.div>
            </div>
          )}
        </Container>
      </main>
      
    </>
  );
}
