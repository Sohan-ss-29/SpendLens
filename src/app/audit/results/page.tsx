'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToolEmoji } from '@/lib/pricing-data';
import type { AuditResult } from '@/types';
import LeadCaptureForm from '@/components/LeadCaptureForm';

interface StoredResult {
  id?: string;              // Supabase UUID from /api/audit response
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
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('spendlens_audit_result');
      if (stored) setData(JSON.parse(stored));
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  // Generate share URL as soon as we have a token
  const shareUrl =
    shareToken
      ? `${typeof window !== 'undefined' ? window.location.origin : 'https://spendlens.credex.rocks'}/audit/${shareToken}`
      : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <main style={{
        minHeight: '100vh', background: 'var(--surface-0)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '16px',
      }}>
        <div className="spinner" style={{ width: '24px', height: '24px' }} />
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '13px',
          color: 'var(--text-muted)', letterSpacing: '0.04em',
        }}>Analyzing your AI spend…</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{
        minHeight: '100vh', background: 'var(--surface-0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: '28px', letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: '12px',
          }}>No audit found</h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500,
            color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6,
          }}>
            Run your audit first to see results.
          </p>
          <Link href="/audit/new" className="btn-primary">
            Start Audit
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </main>
    );
  }

  const savingsColorVar =
    data.totalMonthlySavings > 500 ? 'var(--brand-green)'
    : data.totalMonthlySavings > 100 ? 'var(--brand-amber)'
    : 'var(--brand-cyan)';

  const isHighValue = data.totalMonthlySavings > 500;
  const isOptimal = data.totalMonthlySavings === 0;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface-0)', color: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px', borderRadius: '50%',
        background: 'hsla(262, 75%, 60%, 0.07)',
        filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Header */}
      <div className="page-header" style={{ position: 'relative', zIndex: 10 }}>
        <div className="page-header-inner">
          <Link href="/audit/new" className="back-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </Link>
          <div className="logo-mark">
            <span style={{ fontSize: '16px' }}>🔍</span>
            <span className="gradient-text" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>SpendLens</span>
          </div>
          {/* Share button (shown once we have a token) */}
          {shareUrl ? (
            <button
              id="share-audit-btn"
              type="button"
              onClick={handleCopy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: copied ? 'var(--brand-green)' : 'var(--text-muted)',
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {copied ? '✓ Copied' : '🔗 Share'}
            </button>
          ) : (
            <div style={{ width: '80px' }} />
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '672px', margin: '0 auto',
        padding: '56px 24px 100px',
        position: 'relative', zIndex: 10,
      }}>

        {/* ── Savings hero ─────────────────────────────────────────────── */}
        <div className="results-hero" style={{ marginBottom: '32px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '16px',
          }}>
            Identified monthly savings
          </p>

          <div style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(52px, 10vw, 80px)',
            lineHeight: 1, letterSpacing: '-0.03em',
            color: savingsColorVar, marginBottom: '16px',
          }}>
            ${data.totalMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            <span style={{
              fontSize: '22px', fontFamily: 'var(--font-mono)',
              fontStyle: 'normal', fontWeight: 400,
              color: 'var(--text-muted)', marginLeft: '8px',
            }}>/mo</span>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
            color: 'var(--text-secondary)',
          }}>
            ={' '}
            <span style={{
              fontFamily: 'var(--font-mono)', fontWeight: 500,
              color: 'var(--text-primary)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '6px', padding: '3px 10px',
              fontSize: '13px',
            }}>
              ${data.totalAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
            </span>
          </p>

          {isOptimal && (
            <div style={{
              marginTop: '24px', padding: '14px 20px',
              background: 'hsla(190, 85%, 52%, 0.05)',
              border: '1.5px solid hsla(190, 85%, 52%, 0.2)',
              borderRadius: '10px',
              fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
              color: 'var(--brand-cyan)', lineHeight: 1.5,
            }}>
              ✨ Great news — you&apos;re already spending efficiently!
            </div>
          )}
        </div>

        {/* ── AI Summary ───────────────────────────────────────────────── */}
        {data.aiSummary && (
          <div className="card card--featured-purple" style={{
            padding: '28px 32px', marginBottom: '40px',
            background: 'hsla(262, 75%, 10%, 0.4)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                background: 'hsla(262, 75%, 62%, 0.12)',
                border: '1px solid hsla(262, 75%, 62%, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>🤖</div>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.01em',
                }}>AI Analysis</h2>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
                  color: 'var(--brand-purple)', letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>Powered by Claude</span>
              </div>
            </div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 500,
              fontSize: '15px', lineHeight: 1.75,
              color: 'var(--text-secondary)',
            }}>
              {data.aiSummary}
            </p>
          </div>
        )}

        {/* ── Per-tool results ─────────────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
            letterSpacing: '0.09em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '16px',
          }}>
            Tool-by-tool breakdown
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.results.map((result) => (
              <ResultCard key={result.toolId} result={result} />
            ))}
          </div>
        </div>

        {/* ── Lead Capture (after value shown — spec requirement) ─────── */}
        <div style={{ marginBottom: '40px' }}>
          <LeadCaptureForm
            auditId={data.id}
            totalMonthlySavings={data.totalMonthlySavings}
            totalAnnualSavings={data.totalAnnualSavings}
            toolCount={data.results.length}
            isHighValueContext={isHighValue}
            onShareTokenReceived={(token) => setShareToken(token)}
          />
        </div>

        {/* ── Optimal / low-savings notification widget ─────────────── */}
        {isOptimal && (
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '28px',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 500,
              fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
              marginBottom: '6px',
            }}>
              You&apos;re spending well today — but AI pricing changes weekly.
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '12px',
              color: 'var(--text-muted)',
            }}>
              We&apos;ll let you know when new optimisations apply to your stack.
            </p>
          </div>
        )}

        {/* ── Re-run link ──────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/audit/new" className="btn-ghost" style={{ fontSize: '13px' }}>
            ← Edit tools and re-run
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ── ResultCard component ─────────────────────────────────────────────────── */
function ResultCard({ result }: { result: AuditResult }) {
  const badgeClass =
    result.recommendationType === 'optimal'  ? 'badge badge-optimal'
    : result.recommendationType === 'consolidate' ? 'badge badge-warning'
    : 'badge badge-savings';

  const badgeLabel =
    result.recommendationType === 'optimal'     ? '✓ Optimal'
    : result.recommendationType === 'consolidate' ? '⚠ Redundant'
    : result.recommendationType === 'downgrade'   ? '↓ Downgrade'
    : result.recommendationType === 'switch'      ? '↔ Switch'
    : '↔ Consolidate';

  return (
    <div className={`result-card ${result.monthlySavings > 0 ? 'result-card--savings' : ''}`}>
      <div className="result-card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>{getToolEmoji(result.toolId)}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 600,
                fontSize: '14px', color: 'var(--text-primary)',
              }}>
                {result.toolName}
              </span>
              <span className={badgeClass}>{badgeLabel}</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--text-muted)', marginTop: '3px',
            }}>
              {result.currentPlan}
            </p>
          </div>
        </div>

        {result.monthlySavings > 0 ? (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontWeight: 500,
              fontSize: '18px', color: 'var(--brand-green)',
            }}>
              −${result.monthlySavings.toFixed(0)}
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)',
            }}>
              ${result.annualSavings.toFixed(0)}/yr
            </div>
          </div>
        ) : (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-muted)', letterSpacing: '0.03em',
          }}>
            No change
          </span>
        )}
      </div>

      <div className="result-card-body">
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600,
          fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px',
        }}>
          {result.recommendedAction}
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 500,
          fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          {result.reason}
        </p>
        {result.credexOpportunity && (
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
            color: 'var(--brand-purple)', marginTop: '10px',
          }}>
            💜 Credex credits could reduce your API spend by 20–40%
          </p>
        )}
      </div>
    </div>
  );
}
