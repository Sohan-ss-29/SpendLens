// src/app/audit/[token]/page.tsx
// Public, shareable audit view.
// All PII (email, company name) is stripped — only tools and savings numbers.
// generateMetadata() provides Open Graph + Twitter Card tags for link previews.

import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import type { AuditResult } from '@/types';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://spendlens.credex.rocks';

interface Props { params: Promise<{ token: string }> }

interface SharedAudit {
  share_token: string;
  results: AuditResult[];
  total_monthly_savings: number;
  total_annual_savings: number;
  team_size: number;
  use_case: string;
  tool_count: number;
  ai_summary?: string;
  created_at: string;
}

async function getSharedAudit(token: string): Promise<SharedAudit | null> {
  try {
    const supabase = createServerClient();
    
    // First try the shared_audits table (created via explicit share)
    const { data: sharedData, error: sharedError } = await supabase
      .from('shared_audits')
      .select('*')
      .eq('share_token', token)
      .single();

    if (sharedData && !sharedError) {
      return sharedData as SharedAudit;
    }

    // Fallback: check the main audits table (created via lead capture)
    const { data: auditData, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('share_token', token)
      .single();

    if (auditError || !auditData) return null;

    // Map to SharedAudit shape, explicitly dropping PII (form_data, lead_email)
    const toolsData = auditData.form_data?.tools || [];
    return {
      share_token: auditData.share_token,
      results: auditData.results,
      total_monthly_savings: auditData.total_monthly_savings,
      total_annual_savings: auditData.total_annual_savings,
      team_size: auditData.form_data?.teamSize || 1,
      use_case: auditData.form_data?.useCase || 'General',
      tool_count: toolsData.length,
      ai_summary: auditData.ai_summary,
      created_at: auditData.created_at,
    };
  } catch (err) {
    console.error('Error fetching shared audit:', err);
    return null;
  }
}

// ── Open Graph metadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const audit = await getSharedAudit(token);

  if (!audit) {
    return {
      title: 'AI Spend Audit | SpendLens',
      description: 'Free AI tool cost auditor for startups — find out where you\'re overspending.',
    };
  }

  const savings = audit.total_monthly_savings;
  const title = savings > 0
    ? `AI Spend Audit: $${savings.toLocaleString()}/mo in savings identified | SpendLens`
    : 'AI Spend Audit: Stack looks optimised | SpendLens';
  const description = savings > 0
    ? `This team is overspending on ${audit.tool_count} AI tool${audit.tool_count > 1 ? 's' : ''}. Potential savings: $${savings.toLocaleString()}/month ($${audit.total_annual_savings.toLocaleString()}/year). Run your own free audit at SpendLens.`
    : `This team's ${audit.tool_count}-tool AI stack looks well-optimised. Check your own AI spend at SpendLens — free, instant, no login.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/audit/${token}`,
      siteName: 'SpendLens by Credex',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@credexai',
    },
  };
}

// ── Page component ───────────────────────────────────────────────────────────
export default async function SharedAuditPage({ params }: Props) {
  const { token } = await params;
  const audit = await getSharedAudit(token);

  if (!audit) {
    return (
      <main style={{
        minHeight: '100vh', background: 'var(--surface-0)', color: 'var(--text-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: '28px', letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: '12px',
          }}>Audit not found</h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500,
            color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px',
          }}>
            This audit link may have expired or the token is invalid.
          </p>
          <Link href="/audit/new" className="btn-primary">
            Run My Own Audit
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </main>
    );
  }

  const savingsColorVar =
    audit.total_monthly_savings > 500 ? 'var(--brand-green)'
    : audit.total_monthly_savings > 100 ? 'var(--brand-amber)'
    : 'var(--brand-cyan)';

  const results: AuditResult[] = Array.isArray(audit.results) ? audit.results : [];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface-0)', color: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '500px', borderRadius: '50%',
        background: 'hsla(262, 75%, 60%, 0.07)',
        filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Header */}
      <div className="page-header" style={{ position: 'relative', zIndex: 10 }}>
        <div className="page-header-inner">
          <div style={{ width: '64px' }} />
          <div className="logo-mark">
            <span style={{ fontSize: '16px' }}>🔍</span>
            <span className="gradient-text" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>SpendLens</span>
          </div>
          <Link href="/audit/new" style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '13px',
            color: 'var(--text-primary)', textDecoration: 'none',
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Run Mine →
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '672px', margin: '0 auto',
        padding: '56px 24px 100px',
        position: 'relative', zIndex: 10,
      }}>

        {/* Shared badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)', borderRadius: '100px',
          padding: '5px 14px', marginBottom: '32px',
        }}>
          🔗 Shared audit · No PII shown
        </div>

        {/* ── Savings hero ──────────────────────────────────────────── */}
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
            ${audit.total_monthly_savings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
              ${audit.total_annual_savings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
            </span>
          </p>

          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-muted)', marginTop: '16px', letterSpacing: '0.02em',
          }}>
            Team size: {audit.team_size} · Use case: {audit.use_case} · Tools audited: {audit.tool_count}
          </p>

          {audit.total_monthly_savings === 0 && (
            <div style={{
              marginTop: '24px', padding: '14px 20px',
              background: 'hsla(190, 85%, 52%, 0.05)',
              border: '1.5px solid hsla(190, 85%, 52%, 0.2)',
              borderRadius: '10px',
              fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
              color: 'var(--brand-cyan)', lineHeight: 1.5,
            }}>
              ✨ This team is already spending efficiently!
            </div>
          )}
        </div>

        {/* ── AI Summary ────────────────────────────────────────────── */}
        {audit.ai_summary && (
          <div className="card card--featured-purple" style={{
            padding: '28px 32px', marginBottom: '40px',
            background: 'hsla(262, 75%, 10%, 0.4)',
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
                  color: 'var(--brand-purple)', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>Powered by Claude</span>
              </div>
            </div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 500,
              fontSize: '15px', lineHeight: 1.75, color: 'var(--text-secondary)',
            }}>
              {audit.ai_summary}
            </p>
          </div>
        )}

        {/* ── Per-tool results ──────────────────────────────────────── */}
        {results.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.09em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: '16px',
            }}>
              Tool-by-tool breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.map((result) => (
                <SharedResultCard key={result.toolId} result={result} />
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <div style={{
          background: 'var(--gradient-cta)',
          border: '2px solid hsla(142, 72%, 52%, 0.15)',
          borderRadius: '20px',
          padding: '48px 40px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'var(--gradient-brand)', borderRadius: '20px 20px 0 0',
          }} />
          <h2 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(24px, 4vw, 36px)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: '14px',
          }}>
            How does your AI spend compare?
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 500,
            fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)',
            maxWidth: '380px', margin: '0 auto 32px',
          }}>
            Free. No account. No credit card. Just answers in under two minutes.
          </p>
          <Link href="/audit/new" id="shared-cta-start" className="btn-primary btn-primary--lg">
            Run My Free Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '2px' }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-muted)', marginTop: '16px', letterSpacing: '0.03em',
          }}>
            2 min · instant results · no credit card
          </p>
        </div>
      </div>
    </main>
  );
}

/* ── SharedResultCard (server-safe, no interactivity needed) ─────────────── */
function SharedResultCard({ result }: { result: AuditResult }) {
  const badgeClass =
    result.recommendationType === 'optimal' ? 'badge badge-optimal'
    : result.recommendationType === 'consolidate' ? 'badge badge-warning'
    : 'badge badge-savings';

  const badgeLabel =
    result.recommendationType === 'optimal' ? '✓ Optimal'
    : result.recommendationType === 'consolidate' ? '⚠ Redundant'
    : result.recommendationType === 'downgrade' ? '↓ Downgrade'
    : result.recommendationType === 'switch' ? '↔ Switch'
    : '↔ Consolidate';

  return (
    <div className={`result-card ${result.monthlySavings > 0 ? 'result-card--savings' : ''}`}>
      <div className="result-card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
      </div>
    </div>
  );
}
