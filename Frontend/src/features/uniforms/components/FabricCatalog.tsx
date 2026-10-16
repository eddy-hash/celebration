'use client';
import { cn, formatTsh } from '@/lib/utils';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { FabricProduct } from '../types';

interface FabricCatalogProps {
  products: FabricProduct[];
  text: any;
  lang: 'sw' | 'en';
}

export function FabricCatalog({ products, text, lang }: FabricCatalogProps) {
  if (products.length === 0) return null;

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-base sm:text-lg text-text-primary">{text.catalog}</h2>
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
            <div
              key={p.id}
              className="flex gap-3 p-3 rounded-2xl bg-bg-surface border border-border-subtle
                         hover:border-brand/40 transition"
            >
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden
                              bg-bg-elevated flex-shrink-0 flex items-center justify-center">
                {image ? (
                  <img src={image} alt={name} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <PhotoIcon className="h-8 w-8 text-text-muted" />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="text-text-primary font-semibold text-sm leading-tight">{name}</div>
                  {color && <div className="text-text-muted text-xs mt-1">{color}</div>}
                </div>

                <div className="flex items-end justify-between gap-2 mt-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-text-muted">{text.price}</div>
                    <div className="text-brand font-bold text-base sm:text-lg">{formatTsh(p.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-text-muted">{text.stock}</div>
                    <div className={cn(
                      'text-sm font-bold',
                      p.stock > 10 ? 'text-emerald-500' : p.stock > 0 ? 'text-amber-500' : 'text-red-500',
                    )}>
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
  );
}
