'use client';
import { motion } from 'framer-motion';
import { AdminButton } from '@/components/ui/AdminButton';
import { formatTsh } from '@/lib/utils';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { OrderItem } from '../../types';

export function OrderItemForm({
  item,
  form,
  setForm,
  saving,
  saved,
  text,
  onCancel,
  onSave,
}: {
  item: OrderItem;
  form: any;
  setForm: (f: any) => void;
  saving: boolean;
  saved: boolean;
  text: any;
  onCancel: () => void;
  onSave: () => void;
}) {
  const image = item.imageUrl || '/fabric.jpg';

  return (
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
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">{text.size}</label>
          <input type="text" value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">{text.color}</label>
          <input type="text" value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">{text.qty}</label>
          <input type="number" min={1} value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Math.max(1, Number(e.target.value) || 1) })}
            className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-sm font-mono focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">{text.cost} (TSh)</label>
          <input type="number" min={0} value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: Math.max(0, Number(e.target.value) || 0) })}
            className="w-full h-10 px-3 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-sm font-mono focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-brand/5 border border-brand/20">
        <span className="text-xs text-text-muted">{text.total}</span>
        <span className="text-brand font-bold text-sm">{formatTsh(form.unitPrice * form.quantity)}</span>
      </div>
      <div className="flex gap-2 justify-end">
        <AdminButton onClick={onCancel} variant="outline" size="sm"
          icon={<XMarkIcon className="h-3.5 w-3.5" />} disabled={saving}>
          {text.cancel}
        </AdminButton>
        <AdminButton onClick={onSave} variant="brand" size="sm" loading={saving}
          icon={!saving ? <CheckIcon className="h-3.5 w-3.5" /> : undefined}>
          {saved ? text.saved : text.save}
        </AdminButton>
      </div>
    </motion.div>
  );
}
