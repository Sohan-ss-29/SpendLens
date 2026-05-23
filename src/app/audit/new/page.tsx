import type { Metadata } from 'next';
import AuditForm from '@/components/AuditForm';

export const metadata: Metadata = {
  title: 'Start Your AI Spend Audit | SpendLens',
  description: 'Enter your team\'s AI tool subscriptions and get an instant audit with savings recommendations.',
  robots: { index: false, follow: false },
};

export default function NewAuditPage() {
  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <a href="/" className="back-link">← Back</a>
          <div className="logo-mark">
            <span className="text-xl">🔍</span>
            <span className="font-bold gradient-text">SpendLens</span>
          </div>
          <div className="w-16" /> {/* spacer */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-gray-400 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Free audit · No signup · Takes 2 min
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Your AI <span className="gradient-text">Spend Audit</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Add the AI tools your team pays for. We&apos;ll find every dollar you can save.
          </p>
        </div>

        {/* Form */}
        <AuditForm />
      </div>
    </main>
  );
}
