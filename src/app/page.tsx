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
  {
    icon: '⚡',
    title: 'Instant Analysis',
    desc: 'Checks plan fit, team size alignment, and cross-vendor alternatives in under 1 second.',
  },
  {
    icon: '💰',
    title: 'Exact Dollar Amounts',
    desc: 'Real current pricing from every vendor. Not vague advice — specific savings numbers.',
  },
  {
    icon: '🤖',
    title: 'AI-Written Summary',
    desc: 'A personalized paragraph from Claude explaining your biggest cost opportunities.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Add your tools',
    desc: 'Select the AI tools your team pays for. Takes 60 seconds.',
  },
  {
    num: '02',
    title: 'Get instant audit',
    desc: 'Our engine checks plan fit, team size, and cross-vendor alternatives in real-time.',
  },
  {
    num: '03',
    title: 'See your savings',
    desc: 'Get exact dollar amounts, not vague advice. Act immediately to cut costs.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--surface-0)', color: 'var(--text-primary)' }}>

      {/* ── Ambient background glows ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'var(--gradient-hero)',
        }}
      />
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-60%)',
        width: '800px', height: '800px', borderRadius: '50%',
        background: 'hsla(262, 75%, 60%, 0.09)',
        filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: '45%', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'hsla(190, 85%, 50%, 0.06)',
        filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
      }} />

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav style={{ position: 'relative', zIndex: 20 }}>
        <div style={{
          maxWidth: '1152px', margin: '0 auto', padding: '0 32px',
          height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '17px',
            }}>🔍</div>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800,
              fontSize: '18px', letterSpacing: '-0.02em', color: 'var(--text-primary)',
            }}>
              <span className="gradient-text">Spend</span>Lens
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text-muted)', border: '1px solid var(--border)',
              borderRadius: '100px', padding: '3px 10px',
            }}>by Credex</span>
          </div>

          {/* Nav pill */}
          <div className="glass" style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            padding: '10px 20px', borderRadius: '100px',
            fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: 'var(--brand-green)',
                animation: 'pulseDot 2s ease-in-out infinite',
                display: 'inline-block',
              }} />
              Free forever
            </span>
            <span style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
            <span>No signup required</span>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1000px', margin: '0 auto',
        padding: '96px 32px 128px',   /* pt-24 pb-32 equivalent */
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Launch badge */}
        <div
          className="animate-fade-up glass"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '7px 18px', borderRadius: '100px',
            borderColor: 'hsla(190, 85%, 52%, 0.2)',
            background: 'hsla(190, 85%, 52%, 0.04)',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--brand-cyan)', marginBottom: '48px',
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--brand-cyan)', display: 'inline-block',
            animation: 'pulseDot 2s ease-in-out infinite',
          }} />
          SpendLens 1.0 — Free AI Cost Audit for Startups
        </div>

        {/* Main headline — editorial, display font */}
        <h1
          className="animate-fade-up"
          style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(52px, 8vw, 84px)',
            lineHeight: 0.95, letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '36px',
            animationDelay: '0.12s',
          }}
        >
          Stop burning cash<br />
          on{' '}
          <span className="gradient-text" style={{ fontStyle: 'italic' }}>
            AI subscriptions
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up"
          style={{
            fontFamily: 'var(--font-sans)', fontWeight: 500,
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            lineHeight: 1.7, color: 'var(--text-secondary)',
            maxWidth: '680px', marginBottom: '56px',
            animationDelay: '0.22s',
          }}
        >
          Enter your team&apos;s AI tools and get an instant audit — showing exactly where
          you&apos;re overpaying and how much you can save.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up"
          style={{
            display: 'flex', flexWrap: 'wrap',
            gap: '16px', justifyContent: 'center', alignItems: 'center',
            marginBottom: '80px',
            animationDelay: '0.32s',
          }}
        >
          <Link
            href="/audit/new"
            id="cta-hero-start"
            className="btn-primary btn-primary--lg"
          >
            Start Free Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '2px' }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500,
            color: 'var(--text-muted)', letterSpacing: '0.04em',
            padding: '12px 20px', borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
          }}>
            2 min · instant results · no credit card
          </span>
        </div>

        {/* Tool chips strip */}
        <div
          className="animate-fade-up"
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            justifyContent: 'center', maxWidth: '680px',
            animationDelay: '0.42s',
          }}
        >
          {TOOLS.map((t, i) => (
            <span
              key={t.name}
              className="glass"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '100px',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                color: 'var(--text-secondary)',
                animation: `float 7s ease-in-out infinite`,
                animationDelay: `${i * 0.18}s`,
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <span style={{ fontSize: '15px' }}>{t.emoji}</span>
              {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1152px', margin: '0 auto',
        padding: '80px 32px 120px',
      }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span className="section-label section-label--purple animate-fade-up">
            Capabilities
          </span>
          <h2
            className="animate-fade-up"
            style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 'clamp(36px, 5vw, 54px)',
              lineHeight: 1.0, letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginTop: '24px', marginBottom: '18px',
              animationDelay: '0.1s',
            }}
          >
            Engineered for immediate clarity
          </h2>
          <p
            className="animate-fade-up"
            style={{
              fontFamily: 'var(--font-sans)', fontWeight: 500,
              fontSize: '17px', color: 'var(--text-secondary)',
              lineHeight: 1.7, maxWidth: '520px', margin: '0 auto',
              animationDelay: '0.18s',
            }}
          >
            Deep-dive checks that spot leaks in your AI operational budget — instantly.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card card--featured-purple"
              style={{
                padding: '36px',
                animationDelay: `${i * 0.12}s`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Icon */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px',
                background: 'hsla(262, 75%, 62%, 0.08)',
                border: '1px solid hsla(262, 75%, 62%, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', marginBottom: '28px',
                transition: 'all 0.3s ease',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700,
                fontSize: '18px', letterSpacing: '-0.01em',
                color: 'var(--text-primary)', marginBottom: '12px',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-sans)', fontWeight: 500,
                fontSize: '15px', lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '800px', margin: '0 auto',
        padding: '80px 32px 128px',
      }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="section-label section-label--cyan">
            Process
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(36px, 5vw, 54px)',
            lineHeight: 1.0, letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginTop: '24px', marginBottom: '18px',
          }}>
            How it works
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 500,
            fontSize: '17px', color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            Three steps. Under two minutes.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {STEPS.map((item, i) => (
            <div
              key={item.num}
              className="card"
              style={{
                padding: '32px 36px',
                display: 'flex', alignItems: 'center', gap: '32px',
                animationDelay: `${i * 0.12}s`,
                background: 'var(--gradient-card)',
              }}
            >
              {/* Step number */}
              <div style={{
                flexShrink: 0,
                fontFamily: 'var(--font-mono)', fontWeight: 400,
                fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1,
                letterSpacing: '-0.03em',
                color: 'hsla(262, 75%, 62%, 0.5)',
                userSelect: 'none', minWidth: '64px',
                transition: 'color 0.3s ease',
              }}>
                {item.num}
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  fontSize: '18px', letterSpacing: '-0.01em',
                  color: 'var(--text-primary)', marginBottom: '8px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 500,
                  fontSize: '15px', lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '800px', margin: '0 auto',
        padding: '0 32px 140px',
      }}>
        <div style={{
          background: 'var(--gradient-cta)',
          border: '2px solid hsla(74, 222, 128, 0.12)',
          borderColor: 'hsla(142, 72%, 52%, 0.18)',
          borderRadius: '20px',
          padding: '80px 64px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'var(--gradient-brand)', borderRadius: '20px 20px 0 0',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(34px, 5vw, 52px)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: '20px',
          }}>
            Ready to find your savings?
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 500,
            fontSize: '17px', lineHeight: 1.7, color: 'var(--text-secondary)',
            maxWidth: '420px', margin: '0 auto 44px',
          }}>
            Free. No account. No credit card. Just answers in under two minutes.
          </p>
          <Link
            href="/audit/new"
            id="cta-bottom-start"
            className="btn-primary btn-primary--lg"
          >
            Run My Free Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '2px' }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--border)',
        padding: '48px 32px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 500,
          fontSize: '14px', color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          Built with care by{' '}
          <a
            href="https://credex.ai"
            style={{
              color: 'var(--text-secondary)', fontWeight: 600,
              textDecoration: 'underline', textUnderlineOffset: '3px',
              transition: 'color 0.2s',
            }}
          >
            Credex
          </a>
          {' '}— discounted AI credits for high-growth startups.
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'hsla(215, 15%, 35%, 1)', marginTop: '10px',
          letterSpacing: '0.03em',
        }}>
          © {new Date().getFullYear()} Credex AI Inc.
        </p>
      </footer>
    </main>
  );
}
