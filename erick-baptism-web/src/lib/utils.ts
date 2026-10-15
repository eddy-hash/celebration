import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatTsh(a: number) { return `TSh ${a.toLocaleString('en-US')}`; }
export function formatPhone(p: string) {
  const d = p.replace(/\D/g, '');
  const local = d.startsWith('255') ? '0' + d.slice(3) : d;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}
export function normalizePhone(p: string): string | null {
  const d = p.replace(/\D/g, '');
  if (d.startsWith('255') && d.length === 12) return d;
  if (d.startsWith('0') && d.length === 10) return '255' + d.slice(1);
  if (d.length === 9) return '255' + d;
  return null;
}
export function whatsappLink(phone: string, text: string) {
  const p = phone.replace(/\D/g, '');
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}
export function telLink(phone: string) {
  const d = phone.replace(/\D/g, '');
  const intl = d.startsWith('0') ? '+255' + d.slice(1) : d.startsWith('255') ? '+' + d : d;
  return `tel:${intl}`;
}
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || 'erick';
