'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

// ============ CART ============
export interface CartItem {
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
  forGuest?: string;
}

interface CartStore {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (index: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set((s) => ({ items: [...s.items, item] })),
      remove: (i) => set((s) => ({ items: s.items.filter((_, idx) => idx !== i) })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, it) => sum + it.price * it.quantity, 0),
      count: () => get().items.reduce((sum, it) => sum + it.quantity, 0),
    }),
    {
      name: 'erick-cart',
      skipHydration: true,
    },
  ),
);

// ============ AUTH ============
export interface GuestUser {
  id: string;
  role: 'guest';
  name: string;
  phone: string;
  inviteCode: string;
  tenantId: string;
}

export interface GuestTenant {
  slug: string;
  honoreName: string;
  brandColor: string;
  whatsappNumber: string;
  phonePrimary: string;
  phoneSecondary: string;
}

interface AuthStore {
  token: string | null;
  user: GuestUser | null;
  tenant: GuestTenant | null;
  setAuth: (t: string, u: GuestUser, te: GuestTenant) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      tenant: null,
      setAuth: (token, user, tenant) => {
        set({ token, user, tenant });
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
      },
      logout: () => {
        set({ token: null, user: null, tenant: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('erick-cart');
        }
      },
      isLoggedIn: () => !!get().token,
    }),
    {
      name: 'erick-auth',
      skipHydration: true,
    },
  ),
);

// ============ ADMIN ============
interface AdminStore {
  adminToken: string | null;
  adminUser: { id: string; role: 'admin'; name: string } | null;
  setAdminAuth: (token: string, user: any) => void;
  adminLogout: () => void;
  isAdmin: () => boolean;
}

export const useAdmin = create<AdminStore>()(
  persist(
    (set, get) => ({
      adminToken: null,
      adminUser: null,
      setAdminAuth: (token, user) => {
        set({ adminToken: token, adminUser: user });
        if (typeof window !== 'undefined') localStorage.setItem('admin_token', token);
      },
      adminLogout: () => {
        set({ adminToken: null, adminUser: null });
        if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
      },
      isAdmin: () => !!get().adminToken,
    }),
    {
      name: 'erick-admin',
      skipHydration: true,
    },
  ),
);

// ============ HYDRATION HOOK ============
// Call once in Providers to rehydrate all stores after mount
export function useHydrateStores() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    Promise.all([
      useCart.persist.rehydrate(),
      useAuth.persist.rehydrate(),
      useAdmin.persist.rehydrate(),
    ]).then(() => setDone(true));
  }, []);
  return done;
}

// ============ HYDRATION HOOK (per-store) ============
export function useAdminHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return useAdmin.persist?.hasHydrated?.() ?? false;
  });

  useEffect(() => {
    if (hydrated) return;
    // Poll until hydration completes (max ~2s)
    let attempts = 0;
    const check = () => {
      const ok = useAdmin.persist?.hasHydrated?.() ?? false;
      if (ok) {
        setHydrated(true);
        return;
      }
      attempts++;
      if (attempts > 40) {
        // fallback: force-rehydrate
        useAdmin.persist.rehydrate().then(() => setHydrated(true));
        return;
      }
      setTimeout(check, 50);
    };
    check();
  }, [hydrated]);

  return hydrated;
}

export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return useAuth.persist?.hasHydrated?.() ?? false;
  });

  useEffect(() => {
    if (hydrated) return;
    let attempts = 0;
    const check = () => {
      const ok = useAuth.persist?.hasHydrated?.() ?? false;
      if (ok) { setHydrated(true); return; }
      attempts++;
      if (attempts > 40) {
        useAuth.persist.rehydrate().then(() => setHydrated(true));
        return;
      }
      setTimeout(check, 50);
    };
    check();
  }, [hydrated]);

  return hydrated;
}
