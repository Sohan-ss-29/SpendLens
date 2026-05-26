'use client';

// src/components/LeadCaptureForm.tsx
// Email capture form shown AFTER the user sees their audit results.
// Per spec: email gate must be AFTER value is shown, never before.
//
// Abuse protection:
// - Honeypot field (hidden via CSS — bots fill it in, humans don't)
// - Rate limiting handled server-side in /api/leads
// - Client-side: double-submit guard via isSubmitting state

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Raw shape that the HTML form emits (teamSize is a string from <input type="number">)
const rawSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  companyName: z.string().max(120).optional(),
  role: z.string().max(80).optional(),
  teamSize: z.string().optional(),
  // Honeypot — hidden from real users via aria-hidden + CSS
  website: z.string().optional(),
});

// Transformed / validated output shape
const schema = rawSchema.transform((v) => ({
  ...v,
  teamSize: v.teamSize ? parseInt(v.teamSize, 10) : undefined,
}));

type RawFormValues = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

interface LeadCaptureFormProps {
  auditId?: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolCount: number;
  shareToken?: string;
  onShareTokenReceived?: (token: string) => void;
  isHighValueContext: boolean; // savings > 500
  // Pass full results so /api/leads can create a shared_audits snapshot
  results?: unknown[];
  useCase?: string;
  aiSummary?: string;
}

export default function LeadCaptureForm({
  auditId,
  totalMonthlySavings,
  totalAnnualSavings,
  toolCount,
  shareToken: externalShareToken,
  onShareTokenReceived,
  isHighValueContext,
  results,
  useCase,
  aiSummary,
}: LeadCaptureFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(externalShareToken ?? null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RawFormValues>({
    resolver: zodResolver(schema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  const onSubmit = async (data: RawFormValues) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          companyName: data.companyName || undefined,
          role: data.role || undefined,
          teamSize: data.teamSize ? parseInt(data.teamSize, 10) : undefined,
          auditId,
          totalMonthlySavings,
          totalAnnualSavings,
          toolCount,
          // Pass full audit data so shared_audits snapshot is populated
          results: results || [],
          useCase: useCase || 'general',
          aiSummary: aiSummary || '',
          website: data.website || '', // honeypot
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 429) {
          alert('Too many requests — please wait a moment and try again.');
          return;
        }
        throw new Error(err?.error || 'Submission failed');
      }

      const result = await res.json();
      const token = result.shareToken as string | undefined;
      if (token) {
        setShareToken(token);
        onShareTokenReceived?.(token);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('[LeadCaptureForm] submit error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://spendlens.credex.rocks';
  const shareUrl = shareToken ? `${appUrl}/audit/${shareToken}` : null;

  // ── Post-submission state ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        style={{
          background: 'hsla(142, 72%, 52%, 0.05)',
          border: '1.5px solid hsla(142, 72%, 52%, 0.2)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '16px' }}>✅</div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '22px',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '10px',
          }}
        >
          Audit saved & email sent
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: shareUrl ? '24px' : '0',
          }}
        >
          Check your inbox for a copy of your audit.{' '}
          {isHighValueContext &&
            "We'll reach out about how Credex credits can capture more of your savings."}
        </p>

        {shareUrl && (
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--brand-purple)',
                wordBreak: 'break-all',
                flex: 1,
              }}
            >
              {shareUrl}
            </span>
            <button
              id="copy-share-link"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
              }}
              style={{
                background: 'var(--gradient-brand)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: 'var(--gradient-card)',
        border: '1.5px solid hsla(262, 75%, 62%, 0.2)',
        borderRadius: '16px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--gradient-brand)',
        }}
      />

      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--brand-purple)',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--brand-purple)',
              display: 'inline-block',
              animation: 'pulseDot 2s ease-in-out infinite',
            }}
          />
          {isHighValueContext ? 'Save your audit + get Credex access' : 'Save your audit results'}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '22px',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          {isHighValueContext
            ? 'Get your full report + discount opportunities'
            : 'Email me my audit report'}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {isHighValueContext
            ? `You're leaving $${totalMonthlySavings.toLocaleString()}/mo on the table. Get your shareable report link and a Credex consultation offer.`
            : 'Get a permanent link to this audit you can share with your team or revisit later.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Honeypot (hidden from real users) ────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        {/* ── Required: email ───────────────────────────────────────────────── */}
        <div className="field-group" style={{ marginBottom: '14px' }}>
          <label className="field-label" htmlFor="lead-email">
            Work Email <span style={{ color: 'var(--brand-red)' }}>*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            className="input-field"
            placeholder="you@company.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="field-error">{errors.email.message}</p>
          )}
        </div>

        {/* ── Optional fields ───────────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <div className="field-group">
            <label className="field-label" htmlFor="lead-company">
              Company Name
            </label>
            <input
              id="lead-company"
              type="text"
              className="input-field"
              placeholder="Acme Inc."
              {...register('companyName')}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="lead-role">
              Role
            </label>
            <input
              id="lead-role"
              type="text"
              className="input-field"
              placeholder="CTO, Eng Manager…"
              {...register('role')}
            />
          </div>
        </div>

        <div className="field-group" style={{ marginBottom: '24px' }}>
          <label className="field-label" htmlFor="lead-teamsize">
            Company Team Size
          </label>
          <input
            id="lead-teamsize"
            type="number"
            min={1}
            className="input-field"
            placeholder="e.g. 15"
            {...register('teamSize')}
          />
        </div>

        <button
          id="submit-lead"
          type="submit"
          disabled={isSubmitting}
          className="btn-primary btn-primary--lg w-full"
          style={{ width: '100%' }}
        >
          {isSubmitting ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span className="spinner" />
              Saving...
            </span>
          ) : (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isHighValueContext ? 'Get Full Report + Credex Access' : 'Email Me My Report'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </button>

        <p
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '12px',
            letterSpacing: '0.02em',
          }}
        >
          No spam · No login required · Unsubscribe any time
        </p>
      </form>
    </div>
  );
}
