'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdmin } from '@/lib/store';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'checking' | 'ok' | 'redirecting'>('checking');
  const didCheck = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didCheck.current) return;
    didCheck.current = true;

    const adminToken = localStorage.getItem('admin_token');

    if (!adminToken) {
      setStatus('redirecting');
      router.replace(`/ingia?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Sync Zustand store from localStorage (for AdminSidebar/adminUser name)
    try {
      const persisted = localStorage.getItem('erick-admin');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        const state = parsed?.state;
        if (state?.adminToken && state?.adminUser) {
          useAdmin.setState({
            adminToken: state.adminToken,
            adminUser: state.adminUser,
          });
        }
      }
    } catch {}

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
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminTopbar />
          <div className="p-4 sm:p-5 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
