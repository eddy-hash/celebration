'use client';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { Container } from '@/components/ui/Container';
import { PhoneIcon, ChatBubbleLeftRightIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { formatPhone, telLink, whatsappLink } from '@/lib/utils';

export function ContactPage() {
  const { t } = useI18n();
  const { tenant } = useAuth();
  const p1 = tenant?.phonePrimary || '0710209220';
  const p2 = tenant?.phoneSecondary || '0692506552';
  const wa = tenant?.whatsappNumber || '255710209220';

  const cards = [
    { icon: PhoneIcon, title: t('contact.phone'), content: formatPhone(p1), href: telLink(p1) },
    { icon: PhoneIcon, title: t('contact.phone'), content: formatPhone(p2), href: telLink(p2) },
    { icon: ChatBubbleLeftRightIcon, title: t('contact.whatsapp'), content: 'Chat', href: whatsappLink(wa, 'Habari') },
    { icon: ClockIcon, title: t('contact.hours'), content: t('contact.hoursValue') },
    { icon: MapPinIcon, title: 'Mahali', content: 'Tanzania' },
  ];

  return (
    <>
      
      <main className="min-h-screen py-12">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="eyebrow">Mawasiliano</p>
            <h1 className="font-display text-5xl text-text-primary mt-3">{t('contact.title')}</h1>
            <p className="text-text-secondary mt-3">{t('contact.subtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {cards.map((c, i) => {
              const Icon = c.icon;
              const Wrap = c.href ? motion.a : motion.div;
              return (
                <Wrap
                  key={i}
                  href={c.href}
                  target={c.href?.startsWith('http') ? '_blank' : undefined}
                  rel={c.href?.startsWith('http') ? 'noopener' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="card p-6 flex items-center gap-4 cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-xl border border-brand/30 bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-text-muted uppercase tracking-wider">{c.title}</div>
                    <div className="text-text-primary font-semibold mt-1">{c.content}</div>
                  </div>
                </Wrap>
              );
            })}
          </div>
        </Container>
      </main>
      
    </>
  );
}
