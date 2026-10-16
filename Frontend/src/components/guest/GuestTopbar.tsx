'use client';
import { useEffect, useState } from 'react';
import { LanguageSwitch } from '@/components/features/LanguageSwitch';
import { ThemeToggle } from '@/components/features/ThemeToggle';

export function GuestTopbar() {
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    try {
      const p = localStorage.getItem('erick-auth');
      if (p) {
        const parsed = JSON.parse(p);
        const name = parsed?.state?.user?.name;
        if (name) setGuestName(name);
      }
    } catch {}
  }, []);

  return (
    <div className="sticky top-14 lg:top-0 z-30 border-b border-border-subtle bg-bg-base/95 backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8 h-12 lg:h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-wider flex-shrink-0">
            Karibu
          </span>
          <span className="text-sm lg:text-sm font-semibold text-text-primary truncate">
            {guestName || 'Mgeni'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </div>
    </div>
  );
}
