'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth, useAdmin } from '@/lib/store';
import { api } from '@/lib/api';
import { PhoneIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { LanguageSwitch } from '@/components/features/LanguageSwitch';

interface UnifiedLoginResponse {
  type: 'admin' | 'guest';
  accessToken: string;
  user: any;
  tenant?: any;
}

const T = {
  sw: {
    title: 'Karibu',
    subtitle: 'Ingia kwa namba yako ya simu',
    phoneLabel: 'Namba ya Simu',
    phonePlaceholder: '0710 209 220',
    codeLabel: 'Namba ya Mwaliko',
    codePlaceholder: 'INV-A1B2C3',
    submit: 'Ingia',
    date: '08 Novemba 2026',
    phoneRequired: 'Weka namba yako ya simu',
    codeRequired: 'Weka namba ya mwaliko',
    genericError: 'Hitilafu imetokea. Jaribu tena.',
    help: 'Msaada',
  },
  en: {
    title: 'Welcome',
    subtitle: 'Sign in with your phone number',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '0710 209 220',
    codeLabel: 'Invitation Code',
    codePlaceholder: 'INV-A1B2C3',
    submit: 'Sign In',
    date: '08 November 2026',
    phoneRequired: 'Enter your phone number',
    codeRequired: 'Enter your invitation code',
    genericError: 'An error occurred. Try again.',
    help: 'Help',
  },
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAuth } = useAuth();
  const { setAdminAuth } = useAdmin();
  const { lang } = useI18n();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didAutoRedirect = useRef(false);

  const text = T[lang] || T.sw;

  useEffect(() => {
    // Only autofill the code from URL — no auto-redirects
    const c = params.get('code');
    if (c) setCode(c.toUpperCase());
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!phone.trim()) return setError(text.phoneRequired);
    if (!code.trim()) return setError(text.codeRequired);

    setLoading(true);
    try {
      const res = await api
        .post<UnifiedLoginResponse>('/auth/login', {
          phone: phone.trim(),
          code: code.trim(),
        })
        .then((r) => r.data);

      const redirect = params.get('redirect');
      didAutoRedirect.current = true;
      if (res.type === 'admin') {
        setAdminAuth(res.accessToken, res.user);
        localStorage.setItem('admin_token', res.accessToken);
        router.replace(redirect || '/admin');
      } else {
        setAuth(res.accessToken, res.user, res.tenant!);
        localStorage.setItem('token', res.accessToken);
        router.replace(redirect || '/kitambaa');
      }
    } catch (e: any) {
      const msg = e.response?.data?.message;
      setError(typeof msg === 'string' ? msg : Array.isArray(msg) ? msg[0] : text.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100svh] flex flex-col bg-bg-base relative overflow-hidden">
      {/* Soft glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-brand/15 rounded-full blur-[110px]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="currentColor">
            <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
          </svg>
          <span className="font-display text-sm font-bold text-text-primary">Mama Dani</span>
        </Link>
        <LanguageSwitch />
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-5 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-text-primary tracking-tight">
              {text.title}
            </h1>
            <p className="text-text-secondary mt-2 text-sm">
              {text.subtitle}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/25">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-gold text-xs font-semibold">
                {text.date}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs"
            >
              <ExclamationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                {text.phoneLabel}
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={text.phonePlaceholder}
                  autoComplete="tel"
                  autoFocus
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-bg-elevated border border-border-subtle
                             text-text-primary placeholder-text-muted/60 font-mono text-base
                             focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30
                             transition-all"
                />
              </div>
            </div>

            {/* Code */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                {text.codeLabel}
              </label>
              <div className="relative">
                <KeyIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder={text.codePlaceholder}
                  autoComplete="off"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-bg-elevated border border-border-subtle
                             text-text-primary placeholder-text-muted/60 font-mono text-base tracking-wider uppercase
                             focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30
                             transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !phone || !code}
              className="w-full h-12 mt-2 rounded-xl bg-brand text-white font-semibold text-base
                         shadow-button hover:bg-brand-dark active:scale-[0.98]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                text.submit
              )}
            </button>
          </form>

          {/* Help */}
          <p className="mt-8 text-center text-xs text-text-muted">
            {text.help}:{' '}
            <a href="tel:+255710209220" className="text-brand font-semibold">
              0710 209 220
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
