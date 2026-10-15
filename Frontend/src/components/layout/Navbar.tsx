'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth, useCart } from '@/lib/store';
import { LanguageSwitch } from '../features/LanguageSwitch';
import { Container } from '../ui/Container';
import {
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { t } = useI18n();
  const { isLoggedIn, user, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Hide on admin routes — sidebar + topbar handle it
  if (pathname.startsWith('/admin')) return null;

  const cartCount = mounted ? count() : 0;
  const logged = mounted ? isLoggedIn() : false;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-bg-base/90 backdrop-blur-xl border-border-subtle shadow-lg'
          : 'bg-transparent border-transparent',
      )}
    >
      <Container className="flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand" fill="currentColor">
              <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
            </svg>
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-gold" />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl lg:text-2xl font-bold text-white">Mama Dani</div>
            <div className="text-[9px] lg:text-[10px] tracking-[0.28em] text-text-muted font-medium uppercase">
              Baptism Celebration
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink href="/">{t('nav.home')}</NavLink>
          {logged && (
            <>
              <NavLink href="/kitambaa">{t('nav.kitambaa')}</NavLink>
              <NavLink href="/oda-yangu">{t('nav.myOrder')}</NavLink>
            </>
          )}
          <NavLink href="/mawasiliano">{t('nav.contact')}</NavLink>
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <LanguageSwitch className="hidden sm:inline-flex" />

          {logged ? (
            <>
              <Link
                href="/kikapu"
                className="relative p-2 rounded-xl hover:bg-bg-elevated transition"
                aria-label="Cart"
              >
                <ShoppingBagIcon className="h-5 w-5 text-white" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-border-subtle">
                <div className="text-right leading-tight">
                  <div className="text-xs text-text-muted">{t('nav.welcome')}</div>
                  <div className="text-sm font-semibold text-white truncate max-w-[120px]">
                    {user?.name}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-brand transition"
                  title={t('nav.logout')}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </>
          ) : (
            <Link href="/ingia" className="btn-primary h-10 px-5 text-sm">
              {t('nav.login')}
            </Link>
          )}

          <button
            className="lg:hidden p-2 rounded-xl hover:bg-bg-elevated"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border-subtle bg-bg-base/95 backdrop-blur-xl overflow-hidden"
          >
            <Container className="py-4 flex flex-col gap-1">
              {[
                { href: '/', label: t('nav.home') },
                ...(logged
                  ? [
                      { href: '/kitambaa', label: t('nav.kitambaa') },
                      { href: '/oda-yangu', label: t('nav.myOrder') },
                      { href: '/kikapu', label: t('cart.title') },
                    ]
                  : []),
                { href: '/mawasiliano', label: t('nav.contact') },
              ].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl hover:bg-bg-elevated text-white transition"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 flex justify-between items-center">
                <LanguageSwitch />
                {logged && (
                  <button onClick={logout} className="text-sm text-brand font-semibold">
                    {t('nav.logout')}
                  </button>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-sm text-text-secondary hover:text-white transition group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );
}
