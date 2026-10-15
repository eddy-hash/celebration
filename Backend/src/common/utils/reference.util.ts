import { randomUUID } from 'crypto';

export function generateReferenceCode(prefix = 'EBC'): string {
  const d = new Date();
  const date =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${date}-${rand}`;
}

export function generateOrderNumber(prefix = 'ORD'): string {
  const d = new Date();
  const date =
    d.getFullYear().toString().slice(-2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${date}-${rand}`;
}

export function shortId(): string {
  return randomUUID().slice(0, 8);
}
