'use client';
import Link from 'next/link';
import { GUEST_LABELS, type GuestLang } from './nav-config';

export function SidebarHeader({ lang, onNavigate }: { lang: GuestLang; onNavigate?: () => void }) {
  const L = GUEST_LABELS[lang];
  return (
    <Link href="/" onClick={onNavigate}
      className="flex items-center gap-3 px-5 h-16 lg:h-20 border-b border-border-subtle flex-shrink-0">
      <div className="relative">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand" fill="currentColor">
          <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
        </svg>
        <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-gold" />
      </div>
      <div className="leading-none">
        <div className="font-display text-lg font-bold text-text-primary">Mama Dani</div>
        <div className="text-[9px] tracking-[0.25em] text-gold font-semibold uppercase mt-0.5">{L.panel}</div>
      </div>
    </Link>
  );
}
