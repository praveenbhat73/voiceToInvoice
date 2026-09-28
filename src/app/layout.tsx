import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Inter, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import './globals.css';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Voicework — Speak your job notes. Get a ready-to-send invoice.',
  description:
    'Voicework turns a spoken job report into a professional invoice in seconds. Built for plumbers, electricians, HVAC techs, and contractors.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0C0D11',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
