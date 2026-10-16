'use client';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { ADMIN_LABELS, type AdminLang } from './nav-config';

export function SidebarFooter({
  lang, adminName, hydrated, onLogout,
}: {
  lang: AdminLang;
  adminName?: string;
  hydrated: boolean;
  onLogout: () => void;
}) {
  const L = ADMIN_LABELS[lang];
  const initial = (hydrated && adminName?.charAt(0).toUpperCase()) || 'A';

  return (
    <div className="border-t border-border-subtle p-3 flex-shrink-0">
      <div className="flex items-center gap-3 px-2 py-2 mb-2">
        <div className="h-9 w-9 rounded-full bg-gold/20 border border-gold/40
                        flex items-center justify-center flex-shrink-0">
          <span className="text-gold text-sm font-bold">{initial}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-text-primary text-sm font-medium truncate">
            {hydrated ? (adminName || 'Admin') : '…'}
          </div>
          <div className="text-text-muted text-xs truncate">{L.role}</div>
        </div>
      </div>
      <button onClick={onLogout}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                   text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
        <ArrowRightOnRectangleIcon className="h-5 w-5" strokeWidth={1.5} />
        {L.logout}
      </button>
    </div>
  );
}
