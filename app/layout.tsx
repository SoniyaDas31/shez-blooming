import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shez Blooming | Massage & Parlour',
  description:
    'Kerala luxury home-service beauty and massage business. Relax • Rejuvenate • Renew. Founder: Subbulakshmi Das.',
  keywords: 'beauty parlour, home massage, Kerala beauty, saree draping, facial, Shez Blooming, Subbulakshmi Das',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1B4332',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-cream-50 text-stone-800 antialiased selection:bg-gold-200 selection:text-forest-900">
        {children}
      </body>
    </html>
  );
}
