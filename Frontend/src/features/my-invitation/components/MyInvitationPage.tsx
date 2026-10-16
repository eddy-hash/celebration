'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { InvitationCard } from '@/components/guest/InvitationCard';
import { Button } from '@/components/ui/Button';
import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

export function MyInvitationPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const text =
    lang === 'sw'
      ? {
          pageTitle: 'Mwaliko Wako',
          pageSubtitle: 'Kadi yako ya mwaliko kwenye sherehe ya ubatizo',
          copy: 'Nakili Namba',
          copied: 'Imenakiliwa!',
          share: 'Tuma kwa WhatsApp',
        }
      : {
          pageTitle: 'Your Invitation',
          pageSubtitle: 'Your invitation card for the baptism celebration',
          copy: 'Copy Code',
          copied: 'Copied!',
          share: 'Share on WhatsApp',
        };

  function copyCode() {
    if (typeof navigator !== 'undefined' && user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function shareWhatsApp() {
    if (typeof window === 'undefined' || !user?.inviteCode) return;
    const msg =
      lang === 'sw'
        ? `Karibu ${user.name}! Hii ni kadi yako ya mwaliko:\n\nSherehe ya Ubatizo wa Erick Edsoni\n08 Novemba 2026\n\nNamba yako: ${user.inviteCode}`
        : `Welcome ${user.name}! Here is your invitation card:\n\nErick Edsoni Baptism Celebration\n08 November 2026\n\nYour code: ${user.inviteCode}`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-text-secondary">
        {lang === 'sw' ? 'Inapakia...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-10"
      >
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary">
          {text.pageTitle}
        </h1>
        <p className="font-elegant italic text-text-secondary mt-2 text-sm sm:text-base">
          {text.pageSubtitle}
        </p>
      </motion.div>

      <InvitationCard
        celebrant="Erick Edsoni"
        guestName={user.name}
        inviteCode={user.inviteCode}
        locale={lang}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto"
      >
        <Button onClick={copyCode} variant="ghost" className="flex-1">
          {copied ? (
            <>
              <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
              {text.copied}
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-4 w-4" />
              {text.copy}
            </>
          )}
        </Button>
        <Button onClick={shareWhatsApp} variant="whatsapp" className="flex-1">
          <ShareIcon className="h-4 w-4" />
          {text.share}
        </Button>
      </motion.div>
    </div>
  );
}
