import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'SpendLens | AI Tool Cost Auditor for Startups',
  description: 'Free AI spend audit for startup founders and engineering managers. Find out where you\'re overpaying on Cursor, Copilot, Claude, ChatGPT, and more.',
  keywords: ['AI tool cost', 'AI spend audit', 'Cursor pricing', 'GitHub Copilot cost', 'Claude vs ChatGPT price', 'startup AI tools'],
  openGraph: {
    type: 'website',
    siteName: 'SpendLens by Credex',
    title: 'SpendLens | Stop Overpaying for AI Tools',
    description: 'Free 2-minute audit shows exactly where your team is overpaying on AI subscriptions.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SpendLens AI Audit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendLens | Free AI Spend Audit',
    description: 'Find out where you\'re overpaying on AI tools. Takes 2 minutes.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://spendlens.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
