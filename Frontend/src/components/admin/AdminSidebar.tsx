'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, useAdminHydrated } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  HomeIcon, UsersIcon, ShoppingBagIcon, CreditCardIcon,
  SparklesIcon, DocumentTextIcon, ArrowRightOnRectangleIcon,
  Bars3Icon, XMarkIcon, Cog6ToothIcon,
} from '@heroicons/react/24/outline';

type Lang = 'sw' | 'en';

const NAV = {
  sw: [
    { href: '/admin', label: 'Dashibodi', Icon: HomeIcon },
    { href: '/admin/invites', label: 'Waalikwa', Icon: UsersIcon },
    { href: '/admin/orders', label: 'Oda', Icon: ShoppingBagIcon },
    { href: '/admin/payments', label: 'Malipo', Icon: CreditCardIcon },
    { href: '/admin/uniforms', label: 'Kitambaa', Icon: SparklesIcon },
    { href: '/admin/audit-logs', label: 'Kumbukumbu', Icon: DocumentTextIcon },
    { href: '/admin/settings', label: 'Mipangilio', Icon: Cog6ToothIcon },
  ],
  en: [
    { href: '/admin', label: 'Dashboard', Icon: HomeIcon },
    { href: '/admin/invites', label: 'Invites', Icon: UsersIcon },
    { href: '/admin/orders', label: 'Orders', Icon: ShoppingBagIcon },
    { href: '/admin/payments', label: 'Payments', Icon: CreditCardIcon },
    { href: '/admin/uniforms', label: 'Fabrics', Icon: SparklesIcon },
    { href: '/admin/audit-logs', label: 'Audit Logs', Icon: DocumentTextIcon },
    { href: '/admin/settings', label: 'Settings', Icon: Cog6ToothIcon },
  ],
};

const LABELS = {
  sw: { role: 'Msimamizi', logout: 'Toka', panel: 'PANELI YA ADMIN' },
  en: { role: 'Administrator', logout: 'Sign Out', panel: 'ADMIN PANEL' },
};

export function AdminSidebar() {
  const { adminUser, adminLogout } = useAdmin();
  const hydrated = useAdminHydrated();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Read lang from localStorage but keep reactive
  const [lang, setLang] = useState<Lang>('sw');
  useState(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('lang') as Lang | null;
      if (s === 'sw' || s === 'en') setLang(s);
    }
  });

  // Listen for lang changes
  if (typeof window !== 'undefined') {
    // Attach once
    if (!(window as any).__adminSidebarLangBound) {
      (window as any).__adminSidebarLangBound = true;
      const onChange = () => {
        const l = localStorage.getItem('lang') as Lang | null;
        if (l === 'sw' || l === 'en') setLang(l);
      };
      window.addEventListener('langchange', onChange);
      window.addEventListener('storage', onChange);
    }
  }

  const items = NAV[lang];
  const L = LABELS[lang];

  const handleLogout = () => {
    adminLogout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('erick-admin');
    }
    router.replace('/ingia');
  };

  const Content = () => (
    <>
      <Link
        href="/admin"
        className="flex items-center gap-3 px-5 h-16 lg:h-20 border-b border-border-subtle flex-shrink-0"
      >
        <div className="relative">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand" fill="currentColor">
            <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
          </svg>
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-gold" />
        </div>
        <div className="leading-none">
          <div className="font-display text-lg font-bold text-text-primary">Mama Dani</div>
          <div className="text-[9px] tracking-[0.25em] text-gold font-semibold uppercase mt-0.5">
            {L.panel}
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map(({ href, label, Icon }) => {
          const active = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand text-white shadow-button'
                  : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary',
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle p-3 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="h-9 w-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
            <span className="text-gold text-sm font-bold">
              {(hydrated && adminUser?.name?.charAt(0).toUpperCase()) || 'A'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-text-primary text-sm font-medium truncate">
              {hydrated ? (adminUser?.name || 'Admin') : '…'}
            </div>
            <div className="text-text-muted text-xs truncate">{L.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                     text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" strokeWidth={1.5} />
          {L.logout}
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-64
                        bg-bg-elevated border-r border-border-subtle z-40">
        <Content />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-base/95 backdrop-blur-xl
                      border-b border-border-subtle z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl hover:bg-bg-elevated"
          aria-label="Menu"
        >
          <Bars3Icon className="h-6 w-6 text-text-primary" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="currentColor">
            <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
          </svg>
          <span className="font-display text-base font-bold text-text-primary">Mama Dani</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-500/10 text-red-400"
          aria-label="Logout"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-bg-elevated border-r
                         border-border-subtle z-50 flex flex-col"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-bg-surface z-10"
              >
                <XMarkIcon className="h-5 w-5 text-text-primary" />
              </button>
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
