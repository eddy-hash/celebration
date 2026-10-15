'use client';
import { useEffect, useState } from 'react';
import { Api } from '@/lib/api';
import { useAuth, type GuestTenant } from '@/lib/store';

const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || 'mama-dani';

export function TenantBootstrap({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { tenant, setAuth, token, user } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (tenant) return;

    let cancelled = false;
    (async () => {
      try {
        const t = await Api.getTenantConfig(TENANT_SLUG);
        if (cancelled) return;
        const fallback: GuestTenant = {
          slug: t.slug,
          honoreName: t.honoreName,
          brandColor: t.brandColor,
          whatsappNumber: t.whatsappNumber,
          phonePrimary: t.phonePrimary,
          phoneSecondary: t.phoneSecondary,
        };
        if (token && user) {
          setAuth(token, user, fallback);
        } else {
          useAuth.setState({ tenant: fallback });
        }
      } catch {
        if (cancelled) return;
        useAuth.setState({
          tenant: {
            slug: 'mama-dani', honoreName: 'Mama Dani', brandColor: '#E91E63',
            whatsappNumber: '255710209220', phonePrimary: '0710209220',
            phoneSecondary: '0692506552',
          },
        });
      }
    })();

    return () => { cancelled = true; };
  }, [mounted, tenant, token, user, setAuth]);

  return <>{children}</>;
}
