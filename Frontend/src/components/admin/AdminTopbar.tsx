'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin, useAdminHydrated } from '@/lib/store';
import { LanguageSwitch } from '@/components/features/LanguageSwitch';
import { ArrowRightOnRectangleIcon, BellIcon } from '@heroicons/react/24/outline';

export function AdminTopbar() {
  const { adminUser, adminLogout } = useAdmin();
  const hydrated = useAdminHydrated();
  const router = useRouter();
  const [lang, setLang] = useState<'sw' | 'en'>('sw');

  useEffect(() => {
    const s = localStorage.getItem('lang') as 'sw' | 'en' | null;
    if (s) setLang(s);
    const onChange = () => {
      const l = localStorage.getItem('lang') as 'sw' | 'en' | null;
      if (l) setLang(l);
    };
    window.addEventListener('langchange', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('langchange', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const handleLogout = () => {
    adminLogout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('erick-admin');
    }
    router.replace('/ingia');
  };

  const today = new Date().toLocaleDateString(
    lang === 'sw' ? 'sw-TZ' : 'en-US',
    { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' },
  );

  return (
    <div className="hidden lg:flex sticky top-0 z-30 h-20 items-center justify-between
                    px-6 lg:px-10 border-b border-border-subtle bg-bg-base/80 backdrop-blur-xl">
      <div>
        <div className="text-xs text-text-muted uppercase tracking-wider">{today}</div>
        <div className="text-sm font-semibold text-white mt-0.5">
          {lang === 'sw' ? 'Karibu tena' : 'Welcome back'},{' '}
          <span className="text-brand">
            {hydrated ? (adminUser?.name || 'Admin') : '…'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitch />

        <button
          className="relative p-2.5 rounded-xl hover:bg-bg-elevated transition"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5 text-white" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand" />
        </button>

        <div className="h-8 w-px bg-border-subtle" />

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                     text-red-400 hover:bg-red-500/10 transition"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" strokeWidth={1.5} />
          {lang === 'sw' ? 'Toka' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
