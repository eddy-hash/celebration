'use client';
import { useI18n } from '@/lib/i18n';
import { PageHeader } from '@/components/primitives/PageHeader';
import { EmptyState } from '@/components/primitives/EmptyState';
import { LoadingState } from '@/components/primitives/LoadingState';
import { AdminButton } from '@/components/ui/AdminButton';
import { ArrowPathIcon, InboxIcon } from '@heroicons/react/24/outline';
import { useUniforms } from '../hooks/useUniforms';
import { FabricCatalog } from './FabricCatalog';
import { EditableOrderCard } from './EditableOrderCard';
import { UNIFORMS_I18N } from '../constants';

export function AdminUniformsPage() {
  const { lang } = useI18n();
  const text = UNIFORMS_I18N[lang];
  const { products, orders, loading, refresh } = useUniforms();

  return (
    <div className="space-y-5">
      <PageHeader
        title={text.title}
        subtitle={text.subtitle}
        action={
          <AdminButton onClick={refresh} disabled={loading} variant="outline" size="icon">
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </AdminButton>
        }
      />

      {/* Fabric catalog */}
      {!loading && <FabricCatalog products={products} text={text} lang={lang} />}

      {/* Orders with editable items */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base sm:text-lg text-text-primary">{text.orders}</h2>
            <p className="text-text-muted text-xs mt-0.5">{text.ordersDesc}</p>
          </div>
          <span className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                           bg-brand/10 border border-brand/30 text-brand text-xs font-bold">
            {orders.length}
          </span>
        </div>

        {loading ? (
          <LoadingState />
        ) : orders.length === 0 ? (
          <EmptyState icon={InboxIcon} title={text.empty} description={text.emptyDesc} />
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <EditableOrderCard key={o.id} order={o} text={text} lang={lang} onSaved={refresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
