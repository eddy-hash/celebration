'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { SidebarContent } from './sidebar/SidebarContent';
import type { GuestLang } from './sidebar/nav-config';

export function GuestSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<GuestLang>('sw');
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    const s = localStorage.getItem('lang') as GuestLang | null;
    if (s === 'sw' || s === 'en') setLang(s);
    try {
      const p = localStorage.getItem('erick-auth');
      if (p) {
        const name = JSON.parse(p)?.state?.user?.name;
        if (name) setGuestName(name);
      }
    } catch {}
    const onChange = () => {
      const l = localStorage.getItem('lang') as GuestLang | null;
      if (l === 'sw' || l === 'en') setLang(l);
    };
    window.addEventListener('langchange', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('langchange', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('erick-auth');
    localStorage.removeItem('erick-cart');
    router.replace('/ingia');
  };

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-64
                        bg-bg-elevated border-r border-border-subtle z-40">
        <SidebarContent lang={lang} guestName={guestName} onLogout={handleLogout} />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-base/95 backdrop-blur-xl
                      border-b border-border-subtle z-40 flex items-center justify-between px-4">
        <button onClick={() => setOpen(true)} className="p-2 rounded-xl hover:bg-bg-elevated">
          <Bars3Icon className="h-6 w-6 text-text-primary" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="currentColor">
            <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
          </svg>
          <span className="font-display text-sm font-bold text-text-primary">Mama Dani</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-500/10 text-red-400">
          <ArrowRightOnRectangleIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-bg-elevated border-r
                         border-border-subtle z-50 flex flex-col">
              <button onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-bg-surface z-10">
                <XMarkIcon className="h-5 w-5 text-text-primary" />
              </button>
              <SidebarContent lang={lang} guestName={guestName}
                onNavigate={() => setOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
