'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { Container } from '../ui/Container';
import { PhoneIcon, ChatBubbleLeftRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { formatPhone, telLink, whatsappLink } from '@/lib/utils';

export function Footer() {
  const { t } = useI18n();
  const { tenant } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const p1 = (mounted && tenant?.phonePrimary) || '0710209220';
  const p2 = (mounted && tenant?.phoneSecondary) || '0692506552';
  const wa = (mounted && tenant?.whatsappNumber) || '255710209220';

  return (
    <footer className="mt-24 border-t border-border-subtle bg-bg-base">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand" fill="currentColor">
                <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
              </svg>
              <div>
                <div className="font-display text-xl font-bold text-text-primary">Mama Dani</div>
                <div className="text-[9px] tracking-[0.28em] text-text-muted uppercase">
                  Baptism Celebration
                </div>
              </div>
            </div>
            <p className="text-text-secondary text-sm max-w-md leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30">
              <span className="text-gold text-xs font-semibold">
                {t('hero.dateShort')}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-text-muted">
              <MapPinIcon className="h-4 w-4" />
              <span>Tanzania</span>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg text-text-primary mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-text-secondary hover:text-brand transition">{t('nav.home')}</Link></li>
              <li><Link href="/kitambaa" className="text-text-secondary hover:text-brand transition">{t('nav.kitambaa')}</Link></li>
              <li><Link href="/oda-yangu" className="text-text-secondary hover:text-brand transition">{t('nav.myOrder')}</Link></li>
              <li><Link href="/mawasiliano" className="text-text-secondary hover:text-brand transition">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg text-text-primary mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={telLink(p1)} className="flex items-center gap-2 text-text-secondary hover:text-brand transition">
                  <PhoneIcon className="h-4 w-4" />
                  {formatPhone(p1)}
                </a>
              </li>
              <li>
                <a href={telLink(p2)} className="flex items-center gap-2 text-text-secondary hover:text-brand transition">
                  <PhoneIcon className="h-4 w-4" />
                  {formatPhone(p2)}
                </a>
              </li>
              <li>
                <a href={whatsappLink(wa, 'Habari')} target="_blank" rel="noopener"
                   className="flex items-center gap-2 text-text-secondary hover:text-[#25D366] transition">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">{t('footer.copyright')}</p>
          <div className="text-xs text-text-muted">{t('footer.payments')}</div>
        </div>
      </Container>
    </footer>
  );
}
