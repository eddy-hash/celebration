'use client';
import Link from 'next/link';
import { ReactNode } from 'react';

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href}
      className="relative text-sm text-text-secondary hover:text-text-primary transition group">
      {children}
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand scale-x-0
                       group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );
}
