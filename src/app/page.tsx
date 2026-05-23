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
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Hero gradient */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'var(--gradient-hero)' }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-2xl group-hover:animate-[spin_1s_ease-in-out]">🔍</span>
          <span className="font-black text-xl tracking-tight">
            <span className="gradient-text">Spend</span>Lens
          </span>
          <span className="glass rounded-full px-3 py-1 text-xs text-gray-400 ml-2 border-white/5 bg-white/5 hidden sm:inline-block">by Credex</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-400 bg-white/5 px-5 py-2 rounded-full border border-white/5 glass">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" /> Free forever</span>
          <span className="w-px h-4 bg-white/10" />
          <span>No signup</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-24 pb-32 max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center">
        <div className="glass inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-10 text-sm font-medium text-gray-300 border-white/10 bg-white/5 animate-fade-up">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
          </span>
          Trusted by 500+ startup teams · avg saving $2,400/yr
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Stop burning cash<br />
          on <span className="gradient-text">AI subscriptions</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Enter your team&apos;s AI tools and get an instant audit — showing exactly where
          you&apos;re overpaying and how to fix it.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/audit/new"
            id="cta-hero-start"
            className="btn-primary btn-primary--lg animate-pulse-glow text-lg px-10 py-5 rounded-2xl"
          >
            Start Free Audit <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <span className="text-gray-500 text-sm font-medium bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            2 minutes · instant results · no credit card
          </span>
        </div>

        {/* Tool chips */}
        <div className="mt-20 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {TOOLS.map((t, i) => (
            <span 
              key={t.name} 
              className="glass rounded-full px-4 py-2 text-sm font-medium text-gray-300 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default border-white/10"
              style={{ animation: `float 6s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
            >
              <span className="text-lg">{t.emoji}</span> {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card p-8 group hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="text-4xl mb-6 bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">{f.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 py-32 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">How it works</h2>
          <p className="text-xl text-gray-400 font-light">Three simple steps to optimize your AI stack.</p>
        </div>
        
        <div className="space-y-6">
          {[
            { step: '01', title: 'Add your tools', desc: 'Select the AI tools your team pays for — takes exactly 60 seconds.' },
            { step: '02', title: 'Get instant audit', desc: 'Our engine checks plan fit, team size, and cross-vendor alternatives in real-time.' },
            { step: '03', title: 'See your savings', desc: 'Get exact dollar amounts, not vague advice. Act immediately to cut costs.' },
          ].map((item, i) => (
            <div key={item.step} className="card p-8 flex flex-col sm:flex-row items-start sm:items-center gap-8 group hover:border-brand-purple/50 transition-colors">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple font-black text-3xl border border-brand-purple/20 group-hover:scale-110 transition-transform duration-300">
                {item.step}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-lg font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 pt-16 pb-32 max-w-3xl mx-auto text-center w-full">
        <div
          className="card p-12 md:p-16 relative overflow-hidden"
          style={{ background: 'var(--gradient-card)', borderColor: 'var(--border-hover)' }}
        >
          {/* Decorative glow inside card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-md bg-brand-purple/20 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to find your savings?</h2>
            <p className="text-xl text-gray-400 mb-10 font-light">Free. No account. No credit card. Just answers.</p>
            <Link href="/audit/new" id="cta-bottom-start" className="btn-primary btn-primary--lg text-lg px-12 py-5 rounded-2xl">
              Run My Free Audit →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 text-sm text-gray-500 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <p>Built by{' '}
        <a href="https://credex.ai" className="text-white hover:text-brand-cyan transition-colors font-semibold">Credex</a>
        {' '}— discounted AI credits for startups</p>
      </footer>
    </main>
  );
}
