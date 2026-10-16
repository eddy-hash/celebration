'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Input } from '@/components/ui/Input';
import { AdminButton } from '@/components/ui/AdminButton';
import { settingsApi } from '../api/settingsApi';
import { SETTINGS_I18N } from '../constants';
import { CheckCircleIcon, BanknotesIcon, UserCircleIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';
export function AdminSettingsPage() {
  const { lang } = useI18n(); const { tenant } = useAuth(); const text = SETTINGS_I18N[lang];
  const [form, setForm] = useState({ honoreeName: '', phonePrimary: '', phoneSecondary: '', whatsappNumber: '', mixxBusinessNumber: '' });
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false);
  useEffect(() => { const slug = tenant?.slug || 'mama-dani'; settingsApi.getTenant(slug).then((t) => setForm({ honoreeName: t.honoreeName || '', phonePrimary: t.phonePrimary || '', phoneSecondary: t.phoneSecondary || '', whatsappNumber: t.whatsappNumber || '', mixxBusinessNumber: t.mixxBusinessNumber || '' })).catch(console.error); }, [tenant?.slug]);
  async function save() { setSaving(true); try { await new Promise((r) => setTimeout(r, 400)); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); } }
  return (
    <div className="space-y-5 max-w-2xl">
      <PageHeader title={text.title} subtitle={text.subtitle} />
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle"><UserCircleIcon className="h-4 w-4 text-brand" /><h2 className="font-display text-base sm:text-lg text-text-primary">{text.general}</h2></div>
        <Input label={text.honoreeName} value={form.honoreeName} onChange={(e) => setForm({ ...form, honoreeName: e.target.value })} />
      </div>
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle"><PhoneIcon className="h-4 w-4 text-brand" /><h2 className="font-display text-base sm:text-lg text-text-primary">{text.contact}</h2></div>
        <Input label={text.phonePrimary} value={form.phonePrimary} onChange={(e) => setForm({ ...form, phonePrimary: e.target.value })} inputMode="tel" />
        <Input label={text.phoneSecondary} value={form.phoneSecondary} onChange={(e) => setForm({ ...form, phoneSecondary: e.target.value })} inputMode="tel" />
        <Input label={text.whatsapp} value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} inputMode="tel" />
      </div>
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2"><BanknotesIcon className="h-4 w-4 text-brand" /><h2 className="font-display text-base sm:text-lg text-text-primary">{text.payment}</h2></div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30"><LockClosedIcon className="h-3 w-3 text-gold" /><span className="text-gold text-[10px] font-bold uppercase tracking-wider">{text.mixxLocked}</span></span>
        </div>
        <div>
          <label className="label flex items-center gap-1.5 mb-2"><LockClosedIcon className="h-3.5 w-3.5 text-brand" /><span className="text-text-secondary">{text.mixx}</span></label>
          <div className="px-5 py-4 rounded-xl bg-brand/10 border-2 border-brand/40 flex items-center">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-brand tracking-wider select-all">{form.mixxBusinessNumber || '—'}</span>
          </div>
          <p className="mt-3 text-[11px] sm:text-xs text-text-muted leading-relaxed">{text.lockedNote}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <AdminButton onClick={save} loading={saving} variant="brand" size="lg">{text.save}</AdminButton>
        {saved && <span className="inline-flex items-center gap-1.5 text-sm text-emerald-500"><CheckCircleIcon className="h-4 w-4" />{text.saved}</span>}
      </div>
    </div>
  );
}
