'use client';
import { motion } from 'framer-motion';
import { formatTsh } from '@/lib/utils';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import type { OrderItem } from '../../types';

export function OrderItemView({
  item,
  text,
  onEdit,
}: {
  item: OrderItem;
  text: any;
  onEdit: () => void;
}) {
  const image = item.imageUrl || '/fabric.jpg';

  return (
    <motion.div
      key="view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 items-start"
    >
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-bg-elevated
                      border border-border-subtle flex-shrink-0
                      flex items-center justify-center overflow-hidden">
        <img src={image} alt={item.productName} className="w-full h-full object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-text-primary font-semibold text-sm leading-tight line-clamp-2">
          {item.productName}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-text-muted">
          {item.size && <span><span className="text-text-muted">{text.size}:</span> <span className="text-text-primary font-medium">{item.size}</span></span>}
          {item.color && <span><span className="text-text-muted">{text.color}:</span> <span className="text-text-primary font-medium">{item.color}</span></span>}
          <span><span className="text-text-muted">{text.qty}:</span> <span className="text-text-primary font-medium">{item.quantity}</span></span>
        </div>
        <div className="flex items-end justify-between gap-2 mt-2">
          <div className="text-brand font-bold text-sm">{formatTsh(item.unitPrice)}</div>
          <div className="text-text-muted text-[10px]">
            ×{item.quantity} = <span className="text-text-primary font-bold">{formatTsh(item.lineTotal)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="h-9 w-9 rounded-xl border border-border-subtle bg-bg-surface
                   hover:border-brand/40 hover:bg-brand/10 hover:text-brand
                   text-text-muted transition flex items-center justify-center flex-shrink-0"
        title={text.edit}
      >
        <PencilSquareIcon className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
