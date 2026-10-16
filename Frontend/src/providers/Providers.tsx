'use client';
import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from './ThemeProvider';
import { TenantBootstrap } from './TenantBootstrap';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TenantBootstrap>{children}</TenantBootstrap>
      </I18nProvider>
    </ThemeProvider>
  );
}
