import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SpendLens | Free AI Tool Cost Audit for Startups',
  description: 'Stop overpaying for AI subscriptions. Free audit for Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, and more. Takes 2 minutes.',
};

const TOOLS = [
  { emoji: '⌨️', name: 'Cursor' },
  { emoji: '🐙', name: 'Copilot' },
  { emoji: '🤖', name: 'Claude' },
  { emoji: '💬', name: 'ChatGPT' },
  { emoji: '✨', name: 'Gemini' },
  { emoji: '🏄', name: 'Windsurf' },
  { emoji: '🔌', name: 'OpenAI API' },
  { emoji: '🔬', name: 'Anthropic API' },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant Analysis', desc: 'Checks plan fit, team size alignment, and cross-vendor alternatives in under 1 second.' },
  { icon: '💰', title: 'Exact Dollar Amounts', desc: 'Real current pricing from every vendor. Not vague advice — specific savings numbers.' },
  { icon: '🤖', title: 'AI-Written Summary', desc: 'A personalized paragraph from Claude explaining your biggest cost opportunities.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero gradient */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'var(--gradient-hero)' }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span className="font-black text-lg tracking-tight">
            <span className="gradient-text">Spend</span>Lens
          </span>
          <span className="glass rounded-full px-2 py-0.5 text-xs text-gray-500 ml-1">by Credex</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          <span>Free forever</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>No signup</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-12 pb-16 max-w-4xl mx-auto">
        <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm text-gray-300">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Trusted by 500+ startup teams · avg saving $2,400/yr
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
          Stop burning cash<br />
          on <span className="gradient-text">AI subscriptions</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Enter your team&apos;s AI tools and get an instant audit — showing exactly where
          you&apos;re overpaying and how to fix it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/audit/new"
            id="cta-hero-start"
            className="btn-primary btn-primary--lg animate-pulse-glow"
            style={{ animationDuration: '4s' }}
          >
            Start Free Audit <span className="animate-[bounce-x_1.5s_ease-in-out_infinite]">→</span>
          </Link>
          <span className="text-gray-600 text-sm">2 minutes · instant results · no credit card</span>
        </div>

        {/* Tool chips */}
        <div className="mt-14 flex flex-wrap justify-center gap-2">
          {TOOLS.map((t) => (
            <span key={t.name} className="glass rounded-full px-3 py-1.5 text-sm text-gray-400 flex items-center gap-1.5">
              {t.emoji} {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card p-6"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-8">How it works</h2>
        <div className="space-y-4">
          {[
            { step: '01', title: 'Add your tools', desc: 'Select the AI tools your team pays for — takes 60 seconds.' },
            { step: '02', title: 'Get instant audit', desc: 'Our engine checks plan fit, team size, and cross-vendor alternatives.' },
            { step: '03', title: 'See your savings', desc: 'Get exact dollar amounts, not vague advice. Act immediately.' },
          ].map((item) => (
            <div key={item.step} className="card p-5 flex items-start gap-5">
              <span className="gradient-text font-black text-2xl tracking-tighter min-w-[3ch]">{item.step}</span>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 py-16 max-w-2xl mx-auto text-center">
        <div
          className="card p-8"
          style={{ background: 'linear-gradient(135deg, hsla(262,83%,20%,.2) 0%, hsla(198,100%,20%,.1) 100%)', borderColor: 'hsla(262,83%,58%,.2)' }}
        >
          <h2 className="text-3xl font-black mb-3">Ready to find your savings?</h2>
          <p className="text-gray-400 mb-6 text-sm">Free. No account. No credit card. Just answers.</p>
          <Link href="/audit/new" id="cta-bottom-start" className="btn-primary btn-primary--lg">
            Run My Free Audit →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs text-gray-700 border-t border-gray-900">
        Built by{' '}
        <a href="https://credex.ai" className="text-gray-500 hover:text-white transition-colors">Credex</a>
        {' '}— discounted AI credits for startups
      </footer>
    </main>
  );
}
