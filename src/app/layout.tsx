import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Spend Audit | Find Out Where You\'re Overpaying for AI Tools',
  description:
    'Free AI tool spend audit for startup founders and engineering managers. Instantly see which AI subscriptions you can cut, downgrade, or replace — and how much you\'ll save.',
  keywords: [
    'AI tool cost audit',
    'AI subscription savings',
    'Cursor vs GitHub Copilot',
    'ChatGPT vs Claude cost',
    'AI spend optimization',
    'startup AI tools',
  ],
  openGraph: {
    type: 'website',
    siteName: 'AI Spend Audit by Credex',
    title: 'AI Spend Audit | Find Out Where You\'re Overpaying for AI Tools',
    description:
      'Free AI tool spend audit. See which subscriptions to cut and how much you\'ll save. Takes 2 minutes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Spend Audit Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit | Stop Overpaying for AI Tools',
    description:
      'Free audit shows exactly where you\'re wasting money on AI subscriptions. Used by 500+ startup teams.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-gray-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
