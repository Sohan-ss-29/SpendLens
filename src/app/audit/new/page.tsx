// src/app/audit/new/page.tsx
// Multi-tool spend input form
// Full implementation in Day 2 — this is the Day 1 scaffold

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Your AI Spend Audit | AI Spend Audit Tool',
  description:
    'Enter your team\'s AI tool subscriptions to get an instant cost audit with personalized savings recommendations.',
  robots: { index: false, follow: false }, // Don't index the form page
};

export default function NewAuditPage() {
  return (
    <main className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
            ← Back to home
          </a>
          <h1 className="text-4xl font-black mb-3">
            Your AI <span className="gradient-text">Spend Audit</span>
          </h1>
          <p className="text-gray-400">
            Add the AI tools your team uses. We&apos;ll show you exactly how much you can save.
          </p>
        </div>

        {/* Placeholder — form coming in Day 2 */}
        <div className="card p-8 text-center text-gray-500">
          <div className="text-4xl mb-4">🚧</div>
          <p className="text-lg font-medium text-gray-300 mb-2">Form Coming Day 2</p>
          <p className="text-sm">
            Multi-tool input form with react-hook-form + zod validation, localStorage persistence,
            and 8 AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, OpenAI API).
          </p>
        </div>
      </div>
    </main>
  );
}
