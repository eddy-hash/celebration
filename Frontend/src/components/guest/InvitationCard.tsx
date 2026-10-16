'use client';
import { motion } from 'framer-motion';

interface InvitationCardProps {
  celebrant?: string;
  guestName: string;
  inviteCode: string;
  dateSw?: string;
  dateEn?: string;
  locale?: 'sw' | 'en';
  bibleVerse?: string;
}

const T = {
  sw: {
    headline: 'Mwaliko wa Sherehe ya Ubatizo',
    invitePrefix: 'Kwa heshima na furaha, tunakualika',
    celebrationOf: 'Sherehe ya Ubatizo wa',
    guest: 'Mgeni',
    date: 'Tarehe',
    code: 'Namba ya Mwaliko',
    codeNote: 'Hii ni namba yako ya kuingia. Itunze kwa uangalifu.',
    host: 'Familia ya Edsoni',
    signature: 'Kwa Upendo wa Kina',
    verse: 'Basi, kila mmoja wetu aishi maisha yampendezayo Mungu.',
    verseRef: '— Warumi 15:2',
  },
  en: {
    headline: 'Baptism Celebration Invitation',
    invitePrefix: 'With honor and joy, we invite you',
    celebrationOf: 'Baptism Celebration of',
    guest: 'Guest',
    date: 'Date',
    code: 'Invitation Code',
    codeNote: 'This is your entry code. Keep it safe.',
    host: 'The Edsoni Family',
    signature: 'With Deep Love',
    verse: 'Let each of us please his neighbor for his good.',
    verseRef: '— Romans 15:2',
  },
};

export function InvitationCard({
  celebrant = 'Erick Edsoni',
  guestName,
  inviteCode,
  dateSw = 'Jumamosi, 08 Novemba 2026',
  dateEn = 'Saturday, 08 November 2026',
  locale = 'sw',
  bibleVerse,
}: InvitationCardProps) {
  const text = T[locale];
  const date = locale === 'sw' ? dateSw : dateEn;
  const displayVerse = bibleVerse || text.verse;

  const formattedCelebrant = celebrant
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-lg mx-auto"
    >
      <div className="absolute -inset-4 bg-gradient-to-br from-gold/25 via-brand/10 to-gold/25 rounded-[32px] blur-2xl opacity-70" />

      <div className="relative overflow-hidden rounded-[28px] border-2 border-gold/50 bg-gradient-to-b from-bg-elevated to-bg-base shadow-invitation">
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />

        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

        <div className="m-3 sm:m-4 border border-gold/30 rounded-[20px]">
          <div className="px-6 sm:px-10 py-8 sm:py-12 text-center">

            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
              <span className="text-gold text-xs">✦</span>
              <span className="text-gold text-sm">✦</span>
              <span className="text-gold text-xs">✦</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
            </div>

            <p className="font-elegant text-gold text-[10px] sm:text-xs tracking-[0.4em] uppercase font-semibold mb-6">
              {text.headline}
            </p>

            <p className="font-elegant italic text-text-secondary text-sm sm:text-base mb-2">
              {text.invitePrefix}
            </p>

            <p className="font-elegant italic text-text-secondary text-sm sm:text-base mb-1">
              {text.celebrationOf}
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-script text-5xl sm:text-6xl lg:text-7xl text-brand leading-none tracking-wide py-3"
              style={{ textShadow: '0 4px 20px rgba(233, 30, 99, 0.2)' }}
            >
              {formattedCelebrant}
            </motion.h1>

            <div className="flex items-center justify-center gap-3 my-6 sm:my-7">
              <span className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent via-gold/60 to-gold/70" />
              <span className="text-gold text-xl sm:text-2xl">❦</span>
              <span className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent via-gold/60 to-gold/70" />
            </div>

            <div className="mb-6">
              <p className="font-elegant text-[10px] sm:text-xs uppercase tracking-[0.35em] text-text-muted mb-2">
                {text.date}
              </p>
              <p className="font-display text-text-primary text-base sm:text-xl italic">
                {date}
              </p>
            </div>

            <div className="my-7 rounded-2xl border-2 border-dashed border-gold/40 bg-gold/5 px-4 sm:px-6 py-5 sm:py-6">
              <div className="mb-5">
                <p className="font-elegant text-[10px] uppercase tracking-[0.35em] text-text-muted mb-1">
                  {text.guest}
                </p>
                <p className="font-display text-text-primary text-lg sm:text-xl font-semibold">
                  {guestName}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="h-px w-8 bg-gold/40" />
                <span className="text-gold/70 text-[10px]">✦</span>
                <span className="h-px w-8 bg-gold/40" />
              </div>

              <div>
                <p className="font-elegant text-[10px] uppercase tracking-[0.35em] text-gold mb-2 font-semibold">
                  {text.code}
                </p>
                <p className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand tracking-[0.15em] break-all">
                  {inviteCode}
                </p>
                <p className="font-elegant italic text-text-muted text-[11px] sm:text-xs mt-2">
                  {text.codeNote}
                </p>
              </div>
            </div>

            <div className="my-6 sm:my-7 px-2 sm:px-6">
              <p className="font-elegant italic text-text-secondary text-xs sm:text-sm leading-relaxed">
                &ldquo;{displayVerse}&rdquo;
              </p>
              <p className="font-elegant text-gold/80 text-[10px] sm:text-xs mt-1 tracking-wider">
                {text.verseRef}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 my-5">
              <span className="h-px w-6 bg-gold/40" />
              <span className="text-gold/60 text-xs">✦ ✦ ✦</span>
              <span className="h-px w-6 bg-gold/40" />
            </div>

            <div className="mt-6 space-y-1">
              <p className="font-elegant text-text-muted text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">
                {text.signature}
              </p>
              <p className="font-script text-3xl sm:text-4xl text-gold leading-none pt-1">
                {text.host}
              </p>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
      </div>
    </motion.div>
  );
}

function CornerFlourish({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const rotate = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': 'rotate-270',
  }[position];

  const pos = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
  }[position];

  return (
    <div className={`absolute ${pos} ${rotate} pointer-events-none`}>
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="text-gold/60">
        <path d="M 2 25 Q 2 2 25 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 8 25 Q 8 8 25 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        <path d="M 14 25 Q 14 14 25 14" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="2" cy="25" r="2" fill="currentColor" />
        <circle cx="25" cy="2" r="2" fill="currentColor" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" opacity="0.7" />
      </svg>
    </div>
  );
}
