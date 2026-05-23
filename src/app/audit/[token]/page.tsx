// src/app/audit/[token]/page.tsx
import type { Metadata } from 'next';

interface Props { params: Promise<{ token: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  return {
    title: 'Shared AI Spend Audit | SpendLens',
    description: 'View this team\'s AI tool cost audit results.',
    openGraph: { title: 'AI Spend Audit Results', description: 'See how much this team could save on AI tools.' },
  };
}

export default async function SharedAuditPage({ params }: Props) {
  const { token } = await params;
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h1 className="text-xl font-bold mb-2">Shared audit: {token}</h1>
        <p className="text-gray-500 text-sm">Shareable URL view — coming Day 5</p>
      </div>
    </main>
  );
}
