'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToolEmoji, getToolName } from '@/lib/pricing-data';
import type { AuditResult } from '@/types';

interface StoredResult {
  formData: { teamSize: number; useCase: string; tools: unknown[] };
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  createdAt: string;
}

export default function ResultsPage() {
  const [data, setData] = useState<StoredResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('spendlens_audit_result');
      if (stored) setData(JSON.parse(stored));
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="spinner w-8 h-8 mb-4 border-t-white" />
        <p className="text-gray-400 animate-pulse">Analyzing your AI spend...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-3">No audit found</h1>
          <p className="text-gray-400 mb-6">Run your audit first to see results.</p>
          <Link href="/audit/new" className="btn-primary px-6 py-3 inline-block">
            Start Audit →
          </Link>
        </div>
      </main>
    );
  }

  const savingsColor =
    data.totalMonthlySavings > 500
      ? 'text-green-400'
      : data.totalMonthlySavings > 100
      ? 'text-yellow-400'
      : 'text-blue-400';

  return (
    <main className="min-h-screen pb-20 relative overflow-hidden bg-[#05050C] text-white">
      {/* Decorative Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-brand-purple/15 blur-[120px] rounded-full opacity-35 z-0" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 translate-x-1/2 w-[450px] h-[450px] bg-brand-cyan/10 blur-[100px] rounded-full opacity-20 z-0" />

      {/* Header */}
      <div className="page-header relative z-10">
        <div className="page-header-inner">
          <Link href="/audit/new" className="back-link flex items-center gap-1 hover:text-white transition-colors">
            <span>←</span> <span>Back to Edit</span>
          </Link>
          <div className="logo-mark font-extrabold tracking-tight">
            <span className="text-xl">🔍</span>
            <span className="font-black gradient-text">SpendLens</span>
          </div>
          <div className="w-20 hidden xs:block" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-12 relative z-10">
        {/* Hero savings */}
        <div className="results-hero relative overflow-hidden shadow-2xl border border-white/5">
          <p className="text-gray-400 text-sm mb-2 font-medium tracking-wide uppercase">Identified monthly savings</p>
          <div className={`text-6xl sm:text-7xl font-black mb-2 ${savingsColor} tracking-tight`}>
            ${data.totalMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            <span className="text-2xl text-gray-500 font-medium">/mo</span>
          </div>
          <p className="text-gray-400 text-base">
            = <span className="text-white font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm inline-block mt-1">
              ${data.totalAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
            </span>
          </p>
          {data.totalMonthlySavings === 0 && (
            <p className="text-sm text-brand-cyan mt-5 glass rounded-2xl px-5 py-3 border-brand-cyan/20">
              ✨ Great news — you&apos;re already spending efficiently!
            </p>
          )}
        </div>

        {/* AI Summary */}
        {data.aiSummary && (
          <div className="mt-8 card p-7 bg-gradient-to-b from-[#14102c]/40 to-transparent border-brand-purple/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">🤖</span>
              <h2 className="font-bold text-xl text-white">AI Analysis</h2>
              <span className="badge badge-optimal ml-auto text-xs py-1 px-3 border-brand-purple/30 bg-brand-purple/10 text-purple-300">Powered by Claude</span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">{data.aiSummary}</p>
          </div>
        )}

        {/* Per-tool results */}
        <div className="space-y-4 mt-10">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Tool-by-tool breakdown
          </h2>
          {data.results.map((result) => (
            <ResultCard key={result.toolId} result={result} />
          ))}
        </div>

        {/* Credex CTA */}
        {data.totalMonthlySavings > 500 && (
          <div className="credex-cta mt-10 p-8 shadow-2xl rounded-3xl relative overflow-hidden">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold text-xl mb-2 text-white">Save even more with Credex</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-md mx-auto">
              Get discounted AI API credits through Credex — typically 20–40% off list price for startups.
            </p>
            <a
              href="https://credex.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3.5 shadow-[0_0_25px_rgba(168,85,247,0.3)] text-sm"
            >
              Get Discounted Credits →
            </a>
          </div>
        )}

        {/* Rerun */}
        <div className="text-center mt-10">
          <Link href="/audit/new" className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4 font-light">
            ← Edit tools and re-run audit
          </Link>
        </div>
      </div>
    </main>
  );
}

function ResultCard({ result }: { result: AuditResult }) {
  const badgeClass =
    result.recommendationType === 'optimal'
      ? 'badge badge-optimal'
      : result.recommendationType === 'consolidate'
      ? 'badge badge-warning'
      : 'badge badge-savings';

  const badgeLabel =
    result.recommendationType === 'optimal'
      ? '✓ Optimal'
      : result.recommendationType === 'consolidate'
      ? '⚠ Redundant'
      : result.recommendationType === 'downgrade'
      ? '↓ Downgrade'
      : result.recommendationType === 'switch'
      ? '↔ Switch'
      : '↔ Consolidate';

  return (
    <div className={`result-card ${result.monthlySavings > 0 ? 'result-card--savings' : ''}`}>
      <div className="result-card-top">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getToolEmoji(result.toolId)}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{result.toolName}</span>
              <span className={badgeClass}>{badgeLabel}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{result.currentPlan}</p>
          </div>
        </div>
        {result.monthlySavings > 0 ? (
          <div className="text-right">
            <div className="text-green-400 font-bold text-lg">
              −${result.monthlySavings.toFixed(0)}<span className="text-xs font-normal text-gray-500">/mo</span>
            </div>
            <div className="text-xs text-gray-500">${result.annualSavings.toFixed(0)}/yr</div>
          </div>
        ) : (
          <div className="text-xs text-gray-600">No change</div>
        )}
      </div>
      <div className="result-card-body">
        <p className="text-sm font-medium text-white mb-1">{result.recommendedAction}</p>
        <p className="text-xs text-gray-500">{result.reason}</p>
        {result.credexOpportunity && (
          <p className="text-xs text-purple-400 mt-2">
            💜 Credex credits could reduce your API spend by 20–40%
          </p>
        )}
      </div>
    </div>
  );
}
