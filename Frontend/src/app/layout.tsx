import type { Metadata } from 'next';
import { Inter, Playfair_Display, Great_Vibes, Cormorant_Garamond } from 'next/font/google';
import { Providers } from '@/providers/Providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Erick Edsoni Baptism Celebration',
  description: 'Vitambaa bora kwa sherehe yako ya ubatizo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sw"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
