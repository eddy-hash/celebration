'use client';
import { motion } from 'framer-motion';
import { CornerFlourish } from './CornerFlourish';
import { OrnamentRow } from './OrnamentRow';
import { CodeBox } from './CodeBox';
import { VerseBlock } from './VerseBlock';
import { SignatureBlock } from './SignatureBlock';
import { INVITATION_T } from './constants';

interface InvitationCardProps {
  celebrant?: string;
  guestName: string;
  inviteCode: string;
  dateSw?: string;
  dateEn?: string;
  locale?: 'sw' | 'en';
  bibleVerse?: string;
}

export function InvitationCard({
  celebrant = 'Erick Edsoni',
  guestName,
  inviteCode,
  dateSw = 'Jumamosi, 08 Novemba 2026',
  dateEn = 'Saturday, 08 November 2026',
  locale = 'sw',
  bibleVerse,
}: InvitationCardProps) {
  const text = INVITATION_T[locale];
  const date = locale === 'sw' ? dateSw : dateEn;
  const displayVerse = bibleVerse || text.verse;
  const formattedCelebrant = celebrant.split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-br from-gold/25 via-brand/10 to-gold/25
                      rounded-[32px] blur-2xl opacity-70" />
      <div className="relative overflow-hidden rounded-[28px] border-2 border-gold/50
                      bg-gradient-to-b from-bg-elevated to-bg-base shadow-invitation">
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />
        <div className="absolute top-0 left-0 right-0 h-1.5
                        bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
        <div className="m-3 sm:m-4 border border-gold/30 rounded-[20px]">
          <div className="px-6 sm:px-10 py-8 sm:py-12 text-center">
            <OrnamentRow variant="small" />
            <p className="font-elegant text-gold text-[10px] sm:text-xs tracking-[0.4em]
                          uppercase font-semibold mb-6">
              {text.headline}
            </p>
            <p className="font-elegant italic text-text-secondary text-sm sm:text-base mb-2">
              {text.invitePrefix}
            </p>
            <p className="font-elegant italic text-text-secondary text-sm sm:text-base mb-1">
              {text.celebrationOf}
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-script text-5xl sm:text-6xl lg:text-7xl text-brand
                         leading-none tracking-wide py-3"
              style={{ textShadow: '0 4px 20px rgba(233, 30, 99, 0.2)' }}>
              {formattedCelebrant}
            </motion.h1>
            <OrnamentRow variant="large" />
            <div className="mb-6">
              <p className="font-elegant text-[10px] sm:text-xs uppercase tracking-[0.35em]
                            text-text-muted mb-2">
                {text.date}
              </p>
              <p className="font-display text-text-primary text-base sm:text-xl italic">{date}</p>
            </div>
            <CodeBox
              guestName={guestName}
              inviteCode={inviteCode}
              guestLabel={text.guest}
              codeLabel={text.code}
              codeNote={text.codeNote}
            />
            <VerseBlock verse={displayVerse} reference={text.verseRef} />
            <OrnamentRow variant="medium" />
            <SignatureBlock signature={text.signature} host={text.host} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5
                        bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
      </div>
    </motion.div>
  );
}
