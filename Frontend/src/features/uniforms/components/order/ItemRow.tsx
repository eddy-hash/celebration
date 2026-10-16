'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { uniformsApi } from '../../api/uniformsApi';
import type { OrderItem } from '../../types';
import { OrderItemView } from './OrderItemView';
import { OrderItemForm } from './OrderItemForm';

export function ItemRow({ item, text, onSaved }: { item: OrderItem; text: any; onSaved: () => void }) {
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
      await uniformsApi.updateOrderItem(item.id, {
        size: form.size, color: form.color,
        quantity: form.quantity, unitPrice: form.unitPrice,
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

  return (
    <div className="p-3 sm:p-4">
      <AnimatePresence mode="wait">
        {!editing ? (
          <OrderItemView item={item} text={text} onEdit={() => setEditing(true)} />
        ) : (
          <OrderItemForm
            item={item}
            form={form}
            setForm={setForm}
            saving={saving}
            saved={saved}
            text={text}
            onCancel={cancel}
            onSave={save}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
