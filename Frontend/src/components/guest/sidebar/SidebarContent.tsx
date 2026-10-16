'use client';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';
import type { GuestLang } from './nav-config';

interface Props {
  lang: GuestLang;
  guestName?: string;
  onNavigate?: () => void;
  onLogout: () => void;
}

export function SidebarContent({ lang, guestName, onNavigate, onLogout }: Props) {
  return (
    <>
      <SidebarHeader lang={lang} onNavigate={onNavigate} />
      <SidebarNav lang={lang} onNavigate={onNavigate} />
      <SidebarFooter lang={lang} guestName={guestName} onLogout={onLogout} />
    </>
  );
}
