// src/app/audit/[token]/page.tsx
// Public shareable audit view — Day 5 implementation

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { token: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Day 5: fetch audit by token and generate OG tags
  return {
    title: 'Shared AI Spend Audit | AI Spend Audit Tool',
    description: 'View this team\'s AI tool cost audit results.',
    openGraph: {
      title: 'AI Spend Audit Results',
      description: 'See how much this team could save on AI tools.',
    },
  };
}

export default async function SharedAuditPage({ params }: Props) {
  const { token } = params;

  // Day 5: fetch from Supabase by share_token
  // const audit = await getAuditByToken(token);
  // if (!audit) notFound();

  return (
    <main className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 gradient-text">
          Shared Audit: {token}
        </h1>
        <div className="card p-8 text-gray-500">
          <div className="text-4xl mb-4">🚧</div>
          <p>Shareable URL view — Coming Day 5</p>
        </div>
      </div>
    </main>
  );
}
