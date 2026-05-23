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
  createdAt: string;
}

export default function ResultsPage() {
  const [data, setData] = useState<StoredResult | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('spendlens_audit_result');
      if (stored) setData(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

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
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <Link href="/audit/new" className="back-link">← Edit</Link>
          <div className="logo-mark">
            <span className="text-xl">🔍</span>
            <span className="font-bold gradient-text">SpendLens</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10">
        {/* Hero savings */}
        <div className="results-hero">
          <p className="text-gray-400 text-sm mb-2">Identified monthly savings</p>
          <div className={`text-6xl font-black mb-1 ${savingsColor}`}>
            ${data.totalMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            <span className="text-2xl text-gray-500">/mo</span>
          </div>
          <p className="text-gray-400 text-sm">
            = <span className="text-white font-semibold">
              ${data.totalAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
            </span>
          </p>
          {data.totalMonthlySavings === 0 && (
            <p className="text-sm text-blue-400 mt-3 glass rounded-lg px-4 py-2">
              ✨ Great news — you&apos;re already spending efficiently!
            </p>
          )}
        </div>

        {/* Per-tool results */}
        <div className="space-y-3 mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Tool-by-tool breakdown
          </h2>
          {data.results.map((result) => (
            <ResultCard key={result.toolId} result={result} />
          ))}
        </div>

        {/* Credex CTA */}
        {data.totalMonthlySavings > 500 && (
          <div className="credex-cta mt-8">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="font-bold text-lg mb-1">Save even more with Credex</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get discounted AI API credits through Credex — typically 20–40% off list price for startups.
            </p>
            <a
              href="https://credex.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3 inline-block"
            >
              Get Discounted Credits →
            </a>
          </div>
        )}

        {/* Rerun */}
        <div className="text-center mt-8">
          <Link href="/audit/new" className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-4">
            ← Edit tools and re-run
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
