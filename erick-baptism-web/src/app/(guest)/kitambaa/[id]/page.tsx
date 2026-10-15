'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth, useCart } from '@/lib/store';
import { Api, type Product } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { formatTsh, cn } from '@/lib/utils';
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function ProductPage() {
  const { t, lang } = useI18n();
  const { isLoggedIn } = useAuth();
  const { add } = useCart();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/ingia'); return; }
    (async () => {
      try {
        const p = await Api.getProduct(id);
        setProduct(p);
        if (p.sizes?.length) setSize(p.sizes[0]);
        if (p.colors?.length) setColor(p.colors[0]);
      } catch {
        router.push('/kitambaa');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router, isLoggedIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!product) return null;

  const name = lang === 'sw' ? product.nameSw : product.nameEn;
  const desc = lang === 'sw' ? product.descSw : product.descEn;

  const handleAdd = () => {
    add({ productId: product.id, name, price: product.price, size, color, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href="/kitambaa" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition text-sm">
        <ArrowLeftIcon className="h-4 w-4" /> {t('common.back')}
      </Link>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Image — square on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-square lg:aspect-square rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden relative flex items-center justify-center"
        >
          <img
            src={product.images?.[0] || '/fabric.jpg'}
            alt={name}
            className="w-full h-full object-contain p-4 sm:p-6"
          />
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
            {name}
          </h1>

          <div className="mt-2 sm:mt-3">
            <span className="text-brand font-bold text-xl sm:text-2xl lg:text-3xl">
              {formatTsh(product.price)}
            </span>
          </div>

          {desc && (
            <p className="mt-3 sm:mt-4 text-text-secondary leading-relaxed text-sm sm:text-base">
              {desc}
            </p>
          )}

          {/* Size */}
          {product.sizes?.length > 0 && (
            <div className="mt-5">
              <label className="label">{t('kitambaa.size')}</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'min-w-[48px] h-10 px-3 rounded-xl border font-semibold transition-all text-xs sm:text-sm',
                      size === s ? 'bg-brand text-white border-brand shadow-button' : 'border-border-subtle text-text-secondary hover:border-brand/40 hover:text-white',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors?.length > 0 && (
            <div className="mt-4">
              <label className="label">{t('kitambaa.color')}</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'h-10 px-4 rounded-xl border font-semibold transition-all text-xs sm:text-sm',
                      color === c ? 'bg-brand text-white border-brand shadow-button' : 'border-border-subtle text-text-secondary hover:border-brand/40 hover:text-white',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="mt-4">
            <label className="label">{t('kitambaa.quantity')}</label>
            <div className="inline-flex items-center gap-1 border border-border-subtle rounded-xl p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-lg hover:bg-bg-elevated text-white flex items-center justify-center"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold text-white text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="h-9 w-9 rounded-lg hover:bg-bg-elevated text-white flex items-center justify-center"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions — full width on mobile */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Button onClick={handleAdd} className="flex-1 h-12" size="lg">
              {added ? (
                <><CheckCircleIcon className="h-5 w-5" /> {t('kitambaa.added')}</>
              ) : (
                <><ShoppingBagIcon className="h-5 w-5" /> {t('kitambaa.addToCart')}</>
              )}
            </Button>
            <Link href="/kikapu" className="btn-ghost h-12 justify-center">
              {t('cart.checkout')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
