import {
  HomeIcon, SparklesIcon, ShoppingBagIcon, InboxIcon,
  ChatBubbleLeftRightIcon, IdentificationIcon,
} from '@heroicons/react/24/outline';

export const GUEST_NAV = {
  sw: [
    { href: '/', label: 'Nyumbani', Icon: HomeIcon },
    { href: '/mwaliko-wangu', label: 'Mwaliko Wangu', Icon: IdentificationIcon },
    { href: '/kitambaa', label: 'Kitambaa', Icon: SparklesIcon },
    { href: '/kikapu', label: 'Kikapu', Icon: ShoppingBagIcon },
    { href: '/oda-yangu', label: 'Oda Yangu', Icon: InboxIcon },
    { href: '/mawasiliano', label: 'Mawasiliano', Icon: ChatBubbleLeftRightIcon },
  ],
  en: [
    { href: '/', label: 'Home', Icon: HomeIcon },
    { href: '/mwaliko-wangu', label: 'My Invitation', Icon: IdentificationIcon },
    { href: '/kitambaa', label: 'Fabrics', Icon: SparklesIcon },
    { href: '/kikapu', label: 'Cart', Icon: ShoppingBagIcon },
    { href: '/oda-yangu', label: 'My Order', Icon: InboxIcon },
    { href: '/mawasiliano', label: 'Contact', Icon: ChatBubbleLeftRightIcon },
  ],
} as const;

export const GUEST_LABELS = {
  sw: { guest: 'Mgeni', logout: 'Toka', panel: 'MWALIKO' },
  en: { guest: 'Guest', logout: 'Sign Out', panel: 'INVITATION' },
} as const;

export type GuestLang = 'sw' | 'en';
