import {
  HomeIcon, UsersIcon, ShoppingBagIcon, CreditCardIcon,
  SparklesIcon, DocumentTextIcon, Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export const ADMIN_NAV = {
  sw: [
    { href: '/admin', label: 'Dashibodi', Icon: HomeIcon },
    { href: '/admin/invites', label: 'Waalikwa', Icon: UsersIcon },
    { href: '/admin/orders', label: 'Oda', Icon: ShoppingBagIcon },
    { href: '/admin/payments', label: 'Malipo', Icon: CreditCardIcon },
    { href: '/admin/uniforms', label: 'Kitambaa', Icon: SparklesIcon },
    { href: '/admin/audit-logs', label: 'Kumbukumbu', Icon: DocumentTextIcon },
    { href: '/admin/settings', label: 'Mipangilio', Icon: Cog6ToothIcon },
  ],
  en: [
    { href: '/admin', label: 'Dashboard', Icon: HomeIcon },
    { href: '/admin/invites', label: 'Invites', Icon: UsersIcon },
    { href: '/admin/orders', label: 'Orders', Icon: ShoppingBagIcon },
    { href: '/admin/payments', label: 'Payments', Icon: CreditCardIcon },
    { href: '/admin/uniforms', label: 'Fabrics', Icon: SparklesIcon },
    { href: '/admin/audit-logs', label: 'Audit Logs', Icon: DocumentTextIcon },
    { href: '/admin/settings', label: 'Settings', Icon: Cog6ToothIcon },
  ],
} as const;

export const ADMIN_LABELS = {
  sw: { role: 'Msimamizi', logout: 'Toka', panel: 'PANELI YA ADMIN' },
  en: { role: 'Administrator', logout: 'Sign Out', panel: 'ADMIN PANEL' },
} as const;

export type AdminLang = 'sw' | 'en';
