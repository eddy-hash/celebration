'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useAuth, useCart } from '@/lib/store';
import { LanguageSwitch } from '../features/LanguageSwitch';
import { ThemeToggle } from '../features/ThemeToggle';
import { Container } from '../ui/Container';
import { ShoppingBagIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Brand } from './navbar/Brand';
import { NavLink } from './navbar/NavLink';
import { MobileMenu } from './navbar/MobileMenu';
import { NAVBAR_HIDDEN } from './navbar/nav-config';

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

  if (NAVBAR_HIDDEN.some((r) => pathname.startsWith(r))) return null;

  const cartCount = mounted ? count() : 0;
  const logged = mounted ? isLoggedIn() : false;

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300 border-b',
      scrolled ? 'bg-bg-base/90 backdrop-blur-xl border-border-subtle shadow-lg'
               : 'bg-transparent border-transparent',
    )}>
      <Container className="flex items-center justify-between h-16 lg:h-20">
        <Brand />

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

        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle />
          <LanguageSwitch className="hidden sm:inline-flex" />

          {logged ? (
            <>
              <Link href="/kikapu" className="relative p-2 rounded-xl hover:bg-bg-elevated transition" aria-label="Cart">
                <ShoppingBagIcon className="h-5 w-5 text-text-primary" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                                   rounded-full bg-brand text-white text-[10px] font-bold
                                   flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-border-subtle">
                <div className="text-right leading-tight">
                  <div className="text-xs text-text-muted">{t('nav.welcome')}</div>
                  <div className="text-sm font-semibold text-text-primary truncate max-w-[120px]">
                    {user?.name}
                  </div>
                </div>
                <button onClick={logout} title={t('nav.logout')}
                  className="p-2 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-brand transition">
                  <ArrowRightOnRectangleIcon className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </>
          ) : (
            <Link href="/ingia" className="btn-primary h-10 px-5 text-sm">{t('nav.login')}</Link>
          )}

          <button className="lg:hidden p-2 rounded-xl hover:bg-bg-elevated"
            onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <XMarkIcon className="h-5 w-5 text-text-primary" />
                  : <Bars3Icon className="h-5 w-5 text-text-primary" />}
          </button>
        </div>
      </Container>

      <MobileMenu open={open} logged={logged} onClose={() => setOpen(false)} onLogout={logout} />
    </header>
  );
}
