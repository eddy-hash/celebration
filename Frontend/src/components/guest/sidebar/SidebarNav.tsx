'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GUEST_NAV, type GuestLang } from './nav-config';

export function SidebarNav({ lang, onNavigate }: { lang: GuestLang; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = GUEST_NAV[lang];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      {items.map(({ href, label, Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              active ? 'bg-brand text-white shadow-button'
                     : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary',
            )}>
            <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
