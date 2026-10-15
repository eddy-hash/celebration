'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatPhone, whatsappLink } from '@/lib/utils';
import {
  PlusIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon,
  ClipboardDocumentIcon, TrashIcon, CheckCircleIcon,
  XMarkIcon, ArrowPathIcon, UserGroupIcon,
} from '@heroicons/react/24/outline';

type Invite = {
  id: string; guestName: string; guestPhone: string;
  guestCount: number; status: string; inviteCode: string; createdAt: string;
};

const T = {
  sw: {
    title: 'Waalikwa', subtitle: 'Simamia orodha ya waalikwa',
    add: 'Ongeza Mgeni', search: 'Tafuta...',
    name: 'Jina la Mgeni', phone: 'Namba ya Simu', count: 'Idadi',
    create: 'Unda Mwaliko', cancel: 'Ghairi',
    empty: 'Hakuna waalikwa bado', emptyDesc: 'Ongeza mgeni wa kwanza',
    confirmed: 'Wamekubali', pending: 'Wanasubiri', declined: 'Wamekataa',
    copy: 'Nakili', delete: 'Ondoa', guests: 'wageni',
    copied: 'Imenakiliwa!', total: 'Jumla',
    shareMsg: (name: string, code: string) =>
      `Habari ${name}! 🎉\n\nUmealikwa kwenye sherehe ya ubatizo ya Mama Dani — 08 Novemba 2026.\n\nIngia hapa kuchagua kitambaa chako:\nhttp://localhost:3000/ingia?code=${code}\n\nKaribu sana!`,
  },
  en: {
    title: 'Invites', subtitle: 'Manage your guest list',
    add: 'Add Guest', search: 'Search...',
    name: 'Guest Name', phone: 'Phone Number', count: 'Count',
    create: 'Create Invite', cancel: 'Cancel',
    empty: 'No invites yet', emptyDesc: 'Add your first guest',
    confirmed: 'Confirmed', pending: 'Pending', declined: 'Declined',
    copy: 'Copy', delete: 'Delete', guests: 'guests',
    copied: 'Copied!', total: 'Total',
    shareMsg: (name: string, code: string) =>
      `Hi ${name}! 🎉\n\nYou're invited to Mama Dani's baptism celebration — 08 November 2026.\n\nSign in here to choose your fabric:\nhttp://localhost:3000/ingia?code=${code}\n\nWelcome!`,
  },
};

export default function InvitesPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ guestName: '', guestPhone: '', guestCount: 1 });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const tenantId = user?.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';
  const text = T[lang];

  useEffect(() => { load(); }, [tenantId]);

  async function load() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await api.get(`/invitations/tenant/${tenantId}`);
      setInvites(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.guestName.trim() || !form.guestPhone.trim()) {
      setError(lang === 'sw' ? 'Jaza jina na namba ya simu' : 'Fill name and phone');
      return;
    }
    setCreating(true); setError('');
    try {
      await api.post('/invitations', {
        tenantId,
        guestName: form.guestName.trim(),
        guestPhone: form.guestPhone.trim(),
        guestCount: form.guestCount,
      });
      setForm({ guestName: '', guestPhone: '', guestCount: 1 });
      setShowCreate(false);
      await load();
    } catch (e: any) {
      setError(e.response?.data?.message || (lang === 'sw' ? 'Hitilafu' : 'Error'));
    } finally { setCreating(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm(lang === 'sw' ? 'Ondoa mwaliko huu?' : 'Delete this invite?')) return;
    try {
      await api.delete(`/invitations/${id}`);
      await load();
    } catch (e) { console.error(e); }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const filtered = invites.filter((inv) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return inv.guestName.toLowerCase().includes(s)
      || inv.guestPhone.includes(s)
      || inv.inviteCode.toLowerCase().includes(s);
  });

  const statusColor = (s: string): 'success' | 'error' | 'warning' =>
    s === 'confirmed' ? 'success' : s === 'declined' ? 'error' : 'warning';

  const statusLabel = (s: string) =>
    s === 'confirmed' ? text.confirmed : s === 'declined' ? text.declined : text.pending;

  const counts = {
    total: invites.length,
    confirmed: invites.filter(i => i.status === 'confirmed').length,
    pending: invites.filter(i => i.status === 'pending').length,
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white truncate">
            {text.title}
          </h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">{text.subtitle}</p>
        </div>
        <div className="flex gap-2 self-stretch sm:self-auto">
          <button
            onClick={load}
            className="flex-shrink-0 h-10 w-10 rounded-xl border border-border-subtle
                       flex items-center justify-center text-white hover:bg-bg-elevated transition"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-brand text-white font-semibold text-sm
                       shadow-button hover:bg-brand-dark active:scale-[0.98]
                       transition-all flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>{text.add}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={text.search}
          className="w-full h-11 pl-10 pr-3 rounded-xl bg-bg-elevated border border-border-subtle
                     text-white placeholder-text-muted/60 text-sm
                     focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {/* Stats */}
      {invites.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="card p-3 sm:p-4 text-center">
            <div className="font-display text-xl sm:text-2xl font-bold text-white">{counts.total}</div>
            <div className="text-[10px] sm:text-xs text-text-muted mt-0.5 uppercase tracking-wider">
              {text.total}
            </div>
          </div>
          <div className="card p-3 sm:p-4 text-center border-emerald-500/30 bg-emerald-500/5">
            <div className="font-display text-xl sm:text-2xl font-bold text-emerald-400">{counts.confirmed}</div>
            <div className="text-[10px] sm:text-xs text-emerald-400 mt-0.5 uppercase tracking-wider">
              {text.confirmed}
            </div>
          </div>
          <div className="card p-3 sm:p-4 text-center border-amber-500/30 bg-amber-500/5">
            <div className="font-display text-xl sm:text-2xl font-bold text-amber-400">{counts.pending}</div>
            <div className="text-[10px] sm:text-xs text-amber-400 mt-0.5 uppercase tracking-wider">
              {text.pending}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowCreate(false); setError(''); }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <div
                className="w-full sm:max-w-md bg-bg-elevated rounded-t-3xl sm:rounded-2xl border-t sm:border border-border-subtle
                           max-h-[90svh] flex flex-col shadow-2xl"
              >
                {/* Header — pinned */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle flex-shrink-0">
                  <h2 className="font-display text-lg sm:text-xl text-white">{text.add}</h2>
                  <button
                    onClick={() => { setShowCreate(false); setError(''); }}
                    className="p-2 -mr-2 rounded-lg hover:bg-bg-surface"
                  >
                    <XMarkIcon className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Form — scrollable */}
                <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-5 space-y-4">
                  <Input
                    label={text.name}
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    placeholder="Maria Joseph"
                    autoFocus
                    required
                  />
                  <Input
                    label={text.phone}
                    value={form.guestPhone}
                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                    placeholder="0710209220"
                    inputMode="tel"
                    required
                  />
                  <Input
                    label={text.count}
                    type="number"
                    min="1" max="10"
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) || 1 })}
                  />
                  {error && (
                    <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs">
                      {error}
                    </div>
                  )}
                </form>

                {/* Actions — pinned bottom */}
                <div className="flex gap-2 p-4 border-t border-border-subtle flex-shrink-0
                                bg-bg-elevated rounded-b-3xl sm:rounded-b-2xl pb-safe">
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setError(''); }}
                    className="flex-1 h-12 rounded-xl border border-border-subtle text-white font-medium text-sm
                               hover:bg-bg-surface transition"
                  >
                    {text.cancel}
                  </button>
                  <button
                    type="submit"
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex-1 h-12 rounded-xl bg-brand text-white font-semibold text-sm
                               hover:bg-brand-dark disabled:opacity-50 transition
                               flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : text.create}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <UserGroupIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-white text-base sm:text-lg font-semibold">{text.empty}</h3>
          <p className="text-text-muted text-xs sm:text-sm mt-1">{text.emptyDesc}</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-brand text-white
                       font-semibold text-sm hover:bg-brand-dark transition"
          >
            <PlusIcon className="h-4 w-4" />
            {text.add}
          </button>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filtered.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="card p-3 sm:p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm sm:text-base truncate">
                      {inv.guestName}
                    </span>
                    <Badge color={statusColor(inv.status)}>{statusLabel(inv.status)}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-text-secondary flex-wrap">
                    <span>{formatPhone(inv.guestPhone)}</span>
                    <span className="text-text-muted">·</span>
                    <span>{inv.guestCount} {text.guests}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-brand text-[11px] sm:text-xs bg-brand/10 px-2 py-0.5 rounded">
                      {inv.inviteCode}
                    </span>
                    <button
                      onClick={() => copyCode(inv.inviteCode)}
                      className="p-1 rounded hover:bg-bg-surface transition"
                      title={text.copy}
                    >
                      {copied === inv.inviteCode
                        ? <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-400" />
                        : <ClipboardDocumentIcon className="h-3.5 w-3.5 text-text-muted" />}
                    </button>
                    {copied === inv.inviteCode && (
                      <span className="text-[10px] text-emerald-400 font-medium">{text.copied}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  <a
                    href={whatsappLink(inv.guestPhone, text.shareMsg(inv.guestName, inv.inviteCode))}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-[#25D366] text-white
                               text-sm font-semibold hover:brightness-110 transition
                               flex items-center justify-center gap-2"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="h-10 w-10 rounded-xl bg-bg-surface hover:bg-red-500/20 transition
                               flex items-center justify-center flex-shrink-0"
                    title={text.delete}
                  >
                    <TrashIcon className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
