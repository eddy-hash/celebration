'use client';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';
import type { AdminLang } from './nav-config';

interface Props {
  lang: AdminLang;
  adminName?: string;
  hydrated: boolean;
  onNavigate?: () => void;
  onLogout: () => void;
}

export function SidebarContent({ lang, adminName, hydrated, onNavigate, onLogout }: Props) {
  return (
    <>
      <SidebarHeader lang={lang} onNavigate={onNavigate} />
      <SidebarNav lang={lang} onNavigate={onNavigate} />
      <SidebarFooter lang={lang} adminName={adminName} hydrated={hydrated} onLogout={onLogout} />
    </>
  );
}
