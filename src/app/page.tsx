// src/app/page.tsx
// Landing page — hero section + audit form entry point

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Spend Audit | Free Audit for Startup AI Tool Costs',
  description:
    'Find out exactly where your team is overpaying on AI tools. Free audit covers Cursor, GitHub Copilot, Claude, ChatGPT, and more. Takes 2 minutes.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, hsl(262, 83%, 20%) 0%, transparent 60%)',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span className="font-bold text-lg tracking-tight">
            <span className="gradient-text">AI</span> Spend Audit
          </span>
          <span className="text-xs text-gray-500 border border-gray-700 rounded-full px-2 py-0.5 ml-1">
            by Credex
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Free forever</span>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span>No signup required</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 pt-16 pb-12 max-w-4xl mx-auto">
        {/* Social proof badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-gray-300">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Used by 500+ startup teams to save $2,400/yr on average</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
          Stop burning money
          <br />
          on <span className="gradient-text">AI tools</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Enter your team's AI subscriptions and get an instant audit showing
          exactly where you're overspending — and how to cut costs without
          losing productivity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/audit/new"
            id="cta-start-audit"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            Start Free Audit
            <span>→</span>
          </Link>
          <span className="text-gray-500 text-sm">
            Takes 2 minutes · No signup · Instant results
          </span>
        </div>

        {/* Tool logos */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-3 text-gray-500 text-sm">
          <span>Audits:</span>
          {[
            { emoji: '⌨️', name: 'Cursor' },
            { emoji: '🐙', name: 'Copilot' },
            { emoji: '🤖', name: 'Claude' },
            { emoji: '💬', name: 'ChatGPT' },
            { emoji: '✨', name: 'Gemini' },
            { emoji: '🏄', name: 'Windsurf' },
            { emoji: '🔌', name: 'OpenAI API' },
            { emoji: '🔬', name: 'Anthropic API' },
          ].map((tool) => (
            <span
              key={tool.name}
              className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5"
            >
              <span>{tool.emoji}</span>
              <span>{tool.name}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Feature highlights */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⚡',
              title: 'Instant Analysis',
              description:
                'Our audit engine checks plan fit, team size, use case alignment, and cross-vendor alternatives in seconds.',
            },
            {
              icon: '💰',
              title: 'Real Savings Numbers',
              description:
                'We pull current pricing from every vendor. You get exact dollar amounts, not vague advice like "consider downgrading."',
            },
            {
              icon: '🤖',
              title: 'AI-Written Summary',
              description:
                'Get a personalized paragraph from Claude explaining your biggest opportunities in plain English.',
            },
          ].map((feature) => (
            <div key={feature.title} className="card p-6">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 text-center px-6 py-16 max-w-2xl mx-auto">
        <div
          className="card p-8 animate-pulse-glow"
          style={{
            background:
              'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(0,204,255,0.05) 100%)',
            borderColor: 'rgba(124,58,237,0.3)',
          }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to see where your money's going?
          </h2>
          <p className="text-gray-400 mb-6">
            Free audit. No credit card. No account. Just answers.
          </p>
          <Link
            href="/audit/new"
            id="cta-bottom-start-audit"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            Run My Audit Now
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-600 text-sm border-t border-gray-800/50">
        <p>
          Built by{' '}
          <a
            href="https://credex.ai"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Credex
          </a>{' '}
          — discounted AI credits for startups
        </p>
      </footer>
    </main>
  );
}
