import type { Metadata } from 'next';
import AuditForm from '@/components/AuditForm';

export const metadata: Metadata = {
  title: 'Start Your AI Spend Audit | SpendLens',
  description: 'Enter your team\'s AI tool subscriptions and get an instant audit with savings recommendations.',
  robots: { index: false, follow: false },
};

export default function NewAuditPage() {
  return (
    <main className="min-h-screen pb-20 relative overflow-hidden bg-[#05050C] text-white">
      {/* Decorative Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/15 blur-[120px] rounded-full opacity-30 z-0" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-brand-cyan/10 blur-[100px] rounded-full opacity-20 z-0" />

      {/* Header */}
      <div className="page-header relative z-10">
        <div className="page-header-inner">
          <a href="/" className="back-link flex items-center gap-1 hover:text-white transition-colors">
            <span>←</span> <span>Back to Home</span>
          </a>
          <div className="logo-mark font-extrabold tracking-tight">
            <span className="text-xl">🔍</span>
            <span className="font-black gradient-text">SpendLens</span>
          </div>
          <div className="w-20 hidden xs:block" /> {/* spacer */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-gray-400 mb-5 border-white/5 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            Free audit · No signup · Takes 2 min
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">
            Your AI <span className="gradient-text">Spend Audit</span>
          </h1>
          <p className="text-gray-400 text-base max-w-sm mx-auto font-light leading-relaxed">
            Add the AI tools your team pays for. We&apos;ll find every dollar you can save.
          </p>
        </div>

        {/* Form */}
        <div className="relative">
          <AuditForm />
        </div>
      </div>
    </main>
  );
}
