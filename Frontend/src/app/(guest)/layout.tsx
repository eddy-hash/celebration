'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GuestSidebar } from '@/components/guest/GuestSidebar';
import { GuestTopbar } from '@/components/guest/GuestTopbar';

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'checking' | 'ok' | 'redirecting'>('checking');
  const didCheck = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didCheck.current) return;
    didCheck.current = true;

    const guestToken = localStorage.getItem('token');
    const adminToken = localStorage.getItem('admin_token');

    if (!guestToken && !adminToken) {
      setStatus('redirecting');
      router.replace(`/ingia?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (adminToken && !guestToken) {
      setStatus('redirecting');
      router.replace('/admin');
      return;
    }

    setStatus('ok');
  }, [router, pathname]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (status === 'redirecting') return null;

  return (
    <div className="min-h-screen bg-bg-base">
      <GuestSidebar />
      <div className="lg:pl-64">
        {/* Mobile: pt-14 (sidebar topbar) | Desktop: pt-0 */}
        <div className="pt-14 lg:pt-0">
          {/* Mobile + Desktop topbar with greeting + lang */}
          <GuestTopbar />

          {/* Content — mobile-friendly padding */}
          <div className="px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
