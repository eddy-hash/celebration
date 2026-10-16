'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitch } from '@/components/features/LanguageSwitch';
import { ThemeToggle } from '@/components/features/ThemeToggle';
import { Container } from '@/components/ui/Container';

interface Props {
  open: boolean;
  logged: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ open, logged, onClose, onLogout }: Props) {
  const { t } = useI18n();

  const links = [
    { href: '/', label: t('nav.home') },
    ...(logged ? [
      { href: '/kitambaa', label: t('nav.kitambaa') },
      { href: '/oda-yangu', label: t('nav.myOrder') },
      { href: '/kikapu', label: t('cart.title') },
    ] : []),
    { href: '/mawasiliano', label: t('nav.contact') },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border-subtle bg-bg-base/95 backdrop-blur-xl overflow-hidden">
          <Container className="py-4 flex flex-col gap-1">
            {links.map((l, i) => (
              <motion.div key={l.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link href={l.href} onClick={onClose}
                  className="block px-4 py-3 rounded-xl hover:bg-bg-elevated text-text-primary transition">
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <div className="pt-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitch />
              </div>
              {logged && (
                <button onClick={onLogout} className="text-sm text-brand font-semibold">
                  {t('nav.logout')}
                </button>
              )}
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
