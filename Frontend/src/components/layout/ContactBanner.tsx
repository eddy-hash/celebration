'use client';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { Container } from '../ui/Container';
import { GiftIcon, ChatBubbleLeftRightIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { formatPhone, telLink, whatsappLink } from '@/lib/utils';

export function ContactBanner() {
  const { t } = useI18n();
  const { tenant } = useAuth();
  const p1 = tenant?.phonePrimary || '0710209220';
  const p2 = tenant?.phoneSecondary || '0692506552';
  const wa = tenant?.whatsappNumber || '255710209220';

  return (
    <Container className="my-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#C2185B] to-[#E91E63] px-6 sm:px-10 py-10 sm:py-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />

        <div className="relative flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="flex items-center gap-5 text-center lg:text-left">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
            >
              <GiftIcon className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h3 className="font-display text-3xl sm:text-4xl text-white">{t('contact.title')}</h3>
              <p className="mt-2 text-white/85 max-w-md">{t('contact.desc')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <a
              href={whatsappLink(wa, 'Habari, nahitaji maelezo kuhusu kitambaa')}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:brightness-110 transition"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              {t('contact.chat')}
            </a>
            <a
              href={telLink(p1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur text-white font-semibold border border-white/30 hover:bg-white/25 transition"
            >
              <PhoneIcon className="h-5 w-5" />
              {formatPhone(p1)}
            </a>
            <a
              href={telLink(p2)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur text-white font-semibold border border-white/30 hover:bg-white/25 transition"
            >
              <PhoneIcon className="h-5 w-5" />
              {formatPhone(p2)}
            </a>
          </div>
        </div>
      </motion.div>
    </Container>
  );
}
