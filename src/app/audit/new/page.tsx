import type { Metadata } from 'next';
import AuditForm from '@/components/AuditForm';

export const metadata: Metadata = {
  title: 'Start Your AI Spend Audit | SpendLens',
  description: "Enter your team's AI tool subscriptions and get an instant audit with savings recommendations.",
  robots: { index: false, follow: false },
};

export default function NewAuditPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface-0)', color: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glows */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-60%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'hsla(262, 75%, 60%, 0.07)',
        filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Header */}
      <div className="page-header" style={{ position: 'relative', zIndex: 10 }}>
        <div className="page-header-inner">
          <a href="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </a>
          <div className="logo-mark">
            <span style={{ fontSize: '16px' }}>🔍</span>
            <span className="gradient-text" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>SpendLens</span>
          </div>
          <div style={{ width: '64px' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '672px', margin: '0 auto',
        padding: '56px 24px 80px',
        position: 'relative', zIndex: 10,
      }}>
        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--brand-green)',
            border: '1.5px solid hsla(142, 72%, 52%, 0.25)',
            borderRadius: '100px', padding: '5px 14px',
            marginBottom: '28px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--brand-green)', display: 'inline-block',
              animation: 'pulseDot 2s ease-in-out infinite',
            }} />
            Free audit · No signup · 2 min
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(36px, 6vw, 52px)',
            lineHeight: 1.0, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: '16px',
          }}>
            Your AI{' '}
            <span className="gradient-text" style={{ fontStyle: 'italic' }}>
              Spend Audit
            </span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 500,
            fontSize: '16px', lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '400px', margin: '0 auto',
          }}>
            Add the AI tools your team pays for. We&apos;ll find every dollar you can save.
          </p>
        </div>

        {/* Form */}
        <AuditForm />
      </div>
    </main>
  );
}
