'use client';
import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand" fill="currentColor">
          <path d="M10 2h4v4h4v4h-4v12h-4V10H6V6h4V2z" />
        </svg>
        <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-gold" />
      </div>
      <div className="leading-none">
        <div className="font-display text-xl lg:text-2xl font-bold text-text-primary">
          ERICK EDSONI
        </div>
        <div className="text-[9px] lg:text-[10px] tracking-[0.28em] text-text-muted font-medium uppercase">
          Baptism Celebration
        </div>
      </div>
    </Link>
  );
}
