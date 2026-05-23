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
    <main className="min-h-screen relative overflow-x-hidden bg-[#05050C] text-white font-sans">
      {/* Decorative Background Glows (Ambient Orbs) */}
      <div className="pointer-events-none absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/20 blur-[130px] rounded-full opacity-40 z-0" />
      <div className="pointer-events-none absolute top-[30%] right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-brand-cyan/15 blur-[120px] rounded-full opacity-30 z-0" />
      <div className="pointer-events-none absolute top-[60%] left-1/3 w-[600px] h-[600px] bg-brand-purple/10 blur-[150px] rounded-full opacity-20 z-0" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-[700px] h-[700px] bg-brand-cyan/10 blur-[180px] rounded-full opacity-25 z-0" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <span className="text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🔍</span>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            <span className="gradient-text font-black">Spend</span>Lens
          </span>
          <span className="glass rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-2 border-white/5 bg-white/5 hidden sm:inline-block">by Credex</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-300 bg-white/5 px-5 py-2 rounded-full border border-white/10 glass shadow-lg">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" /> Free forever</span>
          <span className="w-px h-4 bg-white/10" />
          <span>No signup required</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-24 pb-28 max-w-5xl mx-auto w-full flex flex-col items-center">
        {/* Glowing Badge */}
        <div className="glass inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-10 text-xs font-semibold uppercase tracking-widest text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5 shadow-[0_0_15px_rgba(34,211,238,0.1)] animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
          </span>
          SpendLens 1.0 — Free Startup AI Cost Audit
        </div>

        {/* Big Bold Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-white animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Stop burning cash<br />
          on <span className="gradient-text bg-gradient-to-r from-brand-purple via-pink-500 to-brand-cyan">AI subscriptions</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 leading-relaxed font-light animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Enter your team&apos;s AI tools and get an instant audit — showing exactly where
          you&apos;re overpaying and how to save thousands.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-up w-full max-w-md sm:max-w-none" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/audit/new"
            id="cta-hero-start"
            className="btn-primary btn-primary--lg text-lg px-12 py-5 rounded-2xl w-full sm:w-auto shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300"
          >
            Start Free Audit <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
          </Link>
          <span className="text-gray-400 text-sm font-medium bg-white/5 px-5 py-3 rounded-2xl border border-white/10 glass w-full sm:w-auto text-center">
            ⚡ 2 mins · Instant audit · No card
          </span>
        </div>

        {/* Floating Tool Chips */}
        <div className="mt-24 flex flex-wrap justify-center gap-3.5 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {TOOLS.map((t, i) => (
            <span 
              key={t.name} 
              className="glass rounded-full px-5 py-2.5 text-sm font-medium text-gray-300 flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default border-white/10 shadow-sm"
              style={{ animation: `float 6s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
            >
              <span className="text-lg">{t.emoji}</span> {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-28 max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-up">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase bg-brand-purple/10 px-4 py-1.5 rounded-full border border-brand-purple/20">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-5 text-white tracking-tight">
            Engineered for immediate clarity
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light mt-3 max-w-2xl mx-auto">
            Our audit engine performs deep-dive checks to spot leaks in your operational AI budget.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card p-9 group hover:-translate-y-2.5 transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Subtle top light reflection line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <div className="text-4xl mb-7 bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10 group-hover:scale-110 group-hover:border-brand-purple/30 group-hover:bg-brand-purple/5 transition-all duration-300 shadow-inner">
                {f.icon}
              </div>
              <h3 className="font-bold text-2xl mb-4 text-white group-hover:text-brand-cyan transition-colors duration-200">{f.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 px-6 py-28 max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="text-xs font-bold tracking-widest text-brand-cyan uppercase bg-brand-cyan/10 px-4 py-1.5 rounded-full border border-brand-cyan/20">
            Process
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-5 text-white tracking-tight">How it works</h2>
          <p className="text-gray-400 text-lg md:text-xl font-light mt-3">Three simple steps to optimize your startup's AI stack.</p>
        </div>
        
        {/* Steps Timeline */}
        <div className="relative space-y-12">
          {/* Vertical timeline connecting line */}
          <div className="absolute left-10 sm:left-[50px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-brand-purple/40 via-brand-cyan/30 to-white/5 hidden xs:block pointer-events-none z-0" />

          {[
            { step: '01', title: 'Add your tools', desc: 'Select the AI tools your team pays for — takes exactly 60 seconds.' },
            { step: '02', title: 'Get instant audit', desc: 'Our engine checks plan fit, team size, and cross-vendor alternatives in real-time.' },
            { step: '03', title: 'See your savings', desc: 'Get exact dollar amounts, not vague advice. Act immediately to cut costs.' },
          ].map((item, i) => (
            <div 
              key={item.step} 
              className="card p-8 flex flex-col xs:flex-row items-start xs:items-center gap-6 sm:gap-8 group hover:border-brand-purple/40 hover:bg-white/[0.03] transition-all duration-300 relative z-10 bg-gradient-to-r from-white/[0.03] to-transparent"
            >
              {/* Number circular badge */}
              <div className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-[#090918] flex items-center justify-center text-brand-purple font-black text-2xl sm:text-4xl border border-white/10 group-hover:scale-105 group-hover:border-brand-purple/40 group-hover:bg-brand-purple/10 group-hover:text-white transition-all duration-300 shadow-md">
                {item.step}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-brand-cyan transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm sm:text-lg font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto text-center w-full">
        <div
          className="card p-12 md:p-20 relative overflow-hidden bg-gradient-to-b from-[#111128] to-[#080815] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl"
        >
          {/* Decorative glowing gradient inside card */}
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/20 blur-[100px] rounded-full pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">Ready to find your savings?</h2>
            <p className="text-lg md:text-2xl text-gray-400 mb-12 font-light max-w-xl">
              Free. No signup required. No credit card. Just pure savings numbers in under 2 minutes.
            </p>
            <Link 
              href="/audit/new" 
              id="cta-bottom-start" 
              className="btn-primary btn-primary--lg text-lg px-14 py-5 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] hover:scale-[1.02] transition-all duration-300"
            >
              Run My Free Audit →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 text-sm text-gray-500 border-t border-white/5 bg-[#040409]/60 backdrop-blur-lg">
        <p className="max-w-2xl mx-auto">
          Built with 💜 by{' '}
          <a href="https://credex.ai" className="text-gray-300 hover:text-brand-cyan transition-colors font-bold hover:underline">
            Credex
          </a>
          {' '}— providing discounted AI API credits for high-growth startups.
        </p>
        <p className="text-xs text-gray-600 mt-2">© {new Date().getFullYear()} Credex AI Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}
