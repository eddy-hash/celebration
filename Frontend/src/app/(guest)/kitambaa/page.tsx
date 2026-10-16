'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { Api, type Category, type Product } from '@/lib/api';
import { Container } from '@/components/ui/Container';
import { formatTsh, cn } from '@/lib/utils';
import { ShoppingBagIcon, FunnelIcon, PhotoIcon } from '@heroicons/react/24/outline';

function CatalogInner() {
  const { t, lang } = useI18n();
  const { user, tenant, isLoggedIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const activeCat = params.get('cat');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(activeCat);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/ingia'); return; }
  }, [router, isLoggedIn]);

  useEffect(() => {
    if (!user?.tenantId) return;
    (async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          Api.getCategories(user.tenantId),
          Api.getProducts(user.tenantId),
        ]);
        setCategories(cats);
        setProducts(prods.items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.tenantId]);

  const filtered = filter ? products.filter((p) => p.categoryId === filter) : products;
  const getName = (p: Product) => (lang === 'sw' ? p.nameSw : p.nameEn);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="px-0.5">
        <p className="eyebrow">{t('categories.eyebrow')}</p>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary mt-1.5 sm:mt-2">
          {t('kitambaa.title')}
        </h1>
        <p className="text-text-secondary mt-1 text-xs sm:text-sm">
          {t('kitambaa.subtitle', { name: tenant?.honoreeName || 'Mama Dani' })}
        </p>
      </div>

      {/* Filter chips — horizontal scroll on mobile */}
      <div className="-mx-3 px-3 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max lg:min-w-0 lg:flex-wrap">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap',
              !filter ? 'bg-brand text-text-primary border-brand' : 'border-border-subtle text-text-secondary hover:border-brand/40 hover:text-text-primary',
            )}
          >
            <FunnelIcon className="h-3.5 w-3.5" />
            Zote
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                'px-3.5 h-9 rounded-full text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap',
                filter === c.id ? 'bg-brand text-text-primary border-brand' : 'border-border-subtle text-text-secondary hover:border-brand/40 hover:text-text-primary',
              )}
            >
              {lang === 'sw' ? c.titleSw : c.titleEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-0 overflow-hidden animate-pulse">
              <div className="aspect-square bg-bg-surface" />
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-3 bg-bg-surface rounded w-2/3" />
                <div className="h-3 bg-bg-surface rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 sm:p-16 text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-3">
            <PhotoIcon className="h-8 w-8 text-brand" />
          </div>
          <h3 className="text-white text-base sm:text-lg font-semibold">{t('kitambaa.empty')}</h3>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{t('kitambaa.emptyDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/kitambaa/${p.id}`} className="card overflow-hidden group block p-0 h-full flex flex-col">
                {/* Image container — square on mobile, 4:5 on desktop */}
                <div className="aspect-square relative overflow-hidden bg-bg-surface flex items-center justify-center">
                  <img
                    src={p.images?.[0] || '/fabric.jpg'}
                    alt={getName(p)}
                    className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-base truncate">
                    {getName(p)}
                  </h3>
                  <div className="flex items-center justify-between gap-2 mt-auto pt-2 sm:pt-3">
                    <div className="text-brand font-bold text-sm sm:text-base lg:text-lg truncate">
                      {formatTsh(p.price)}
                    </div>
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center group-hover:bg-brand transition-colors flex-shrink-0">
                      <ShoppingBagIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand group-hover:text-text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KitambaaPage() {
  return (
    <Suspense fallback={null}>
      <CatalogInner />
    </Suspense>
  );
}
