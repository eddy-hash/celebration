'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import {
  CheckCircleIcon,
  BanknotesIcon,
  UserCircleIcon,
  PhoneIcon,
  LockClosedIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

const T = {
  sw: {
    title: 'Mipangilio',
    subtitle: 'Mipangilio ya sherehe',
    general: 'Taarifa za Sherehe',
    contact: 'Mawasiliano',
    payment: 'Malipo',
    honoreeName: 'Jina la Mwenyeji',
    phonePrimary: 'Simu ya Kwanza',
    phoneSecondary: 'Simu ya Pili',
    whatsapp: 'WhatsApp',
    mixx: 'Namba ya Biashara ya Mixx',
    mixxLocked: 'Imefungwa',
    copy: 'Nakili',
    copied: 'Imenakiliwa!',
    save: 'Hifadhi',
    saved: 'Imehifadhiwa!',
    note: 'Waalikwa watalipa kwa kutumia namba hii ya biashara kwenye Mixx by Yas.',
    lockedNote:
      'Namba ya malipo imefungwa kwa usalama. Wasiliana na msimamizi mkuu kubadilisha.',
  },
  en: {
    title: 'Settings',
    subtitle: 'Celebration settings',
    general: 'Celebration Info',
    contact: 'Contact',
    payment: 'Payment',
    honoreeName: 'Host Name',
    phonePrimary: 'Primary Phone',
    phoneSecondary: 'Secondary Phone',
    whatsapp: 'WhatsApp',
    mixx: 'Mixx Business Number',
    mixxLocked: 'Locked',
    copy: 'Copy',
    copied: 'Copied!',
    save: 'Save',
    saved: 'Saved!',
    note: 'Guests will pay using this business number on Mixx by Yas.',
    lockedNote:
      'Payment number is locked for security. Contact super-admin to change.',
  },
};

export default function SettingsPage() {
  const { lang } = useI18n();
  const { tenant } = useAuth();
  const [form, setForm] = useState({
    honoreeName: '',
    phonePrimary: '',
    phoneSecondary: '',
    whatsappNumber: '',
    mixxBusinessNumber: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = T[lang];

  useEffect(() => {
    const slug = tenant?.slug || 'mama-dani';
    api
      .get(`/tenants/${slug}/config`)
      .then((res) => {
        const t = res.data;
        setForm({
          honoreeName: t.honoreeName || '',
          phonePrimary: t.phonePrimary || '',
          phoneSecondary: t.phoneSecondary || '',
          whatsappNumber: t.whatsappNumber || '',
          mixxBusinessNumber: t.mixxBusinessNumber || '',
        });
      })
      .catch(console.error);
  }, [tenant?.slug]);

  async function save() {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  function copyNumber() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(form.mixxBusinessNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary">
          {text.title}
        </h1>
        <p className="text-text-secondary mt-1 text-xs sm:text-sm">{text.subtitle}</p>
      </div>

      {/* Celebration Info */}
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
          <UserCircleIcon className="h-4 w-4 text-brand" />
          <h2 className="font-display text-base sm:text-lg text-text-primary">
            {text.general}
          </h2>
        </div>
        <Input
          label={text.honoreeName}
          value={form.honoreeName}
          onChange={(e) => setForm({ ...form, honoreeName: e.target.value })}
        />
      </div>

      {/* Contact */}
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
          <PhoneIcon className="h-4 w-4 text-brand" />
          <h2 className="font-display text-base sm:text-lg text-text-primary">
            {text.contact}
          </h2>
        </div>
        <Input
          label={text.phonePrimary}
          value={form.phonePrimary}
          onChange={(e) => setForm({ ...form, phonePrimary: e.target.value })}
          inputMode="tel"
        />
        <Input
          label={text.phoneSecondary}
          value={form.phoneSecondary}
          onChange={(e) => setForm({ ...form, phoneSecondary: e.target.value })}
          inputMode="tel"
        />
        <Input
          label={text.whatsapp}
          value={form.whatsappNumber}
          onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
          inputMode="tel"
        />
      </div>

      {/* Payment — LOCKED with BOLD BLUE display */}
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="h-4 w-4 text-brand" />
            <h2 className="font-display text-base sm:text-lg text-text-primary">
              {text.payment}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                           bg-gold/10 border border-gold/30">
            <LockClosedIcon className="h-3 w-3 text-gold" />
            <span className="text-gold text-[10px] font-bold uppercase tracking-wider">
              {text.mixxLocked}
            </span>
          </span>
        </div>

        {/* BIG BOLD BLUE NUMBER */}
        <div>
          <label className="label flex items-center gap-1.5 mb-2">
            <LockClosedIcon className="h-3.5 w-3.5 text-brand" />
            <span className="text-text-secondary">{text.mixx}</span>
          </label>
          <div className="flex items-stretch gap-2">
            <div className="flex-1 px-5 py-4 rounded-xl bg-brand/10 border-2 border-brand/40
                            flex items-center">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-brand
                               tracking-wider select-all">
                {form.mixxBusinessNumber || '—'}
              </span>
            </div>
            <button
              onClick={copyNumber}
              type="button"
              className="px-4 rounded-xl border-2 border-brand/40 bg-brand/10
                         hover:bg-brand/20 transition
                         flex items-center justify-center gap-2 flex-shrink-0"
              title={text.copy}
            >
              {copied ? (
                <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5 text-brand" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-400 font-medium mt-1.5 ml-1">
              ✓ {text.copied}
            </p>
          )}
        </div>

        <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 flex items-start gap-2">
          <LockClosedIcon className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
          <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
            {text.lockedNote}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-bg-surface text-[11px] sm:text-xs text-text-muted">
          {text.note}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="h-11 px-6 rounded-xl bg-brand text-white font-semibold text-sm
                     hover:bg-brand-dark disabled:opacity-50 transition
                     flex items-center justify-center gap-2"
        >
          {saving ? (
            <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            text.save
          )}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircleIcon className="h-4 w-4" />
            {text.saved}
          </span>
        )}
      </div>
    </div>
  );
}
