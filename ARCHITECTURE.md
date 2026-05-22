# ARCHITECTURE.md — AI Spend Audit Tool (Credex)

> **Mint.com for AI tool costs.** A free audit tool that helps startup founders and engineering managers understand where they're overspending on AI subscriptions and how much they can save.

---

## System Overview

```mermaid
graph TB
    subgraph "Client (Browser)"
        A[Spend Input Form<br/>react-hook-form + zod] --> B[Audit Results Page]
        B --> C[Lead Capture Form]
        B --> D[Shareable URL Copy]
    end

    subgraph "Next.js 14 App Router (Vercel)"
        E[app/page.tsx<br/>Landing + Input Form]
        F[app/audit/page.tsx<br/>Results Display]
        G[app/audit/[token]/page.tsx<br/>Public Shareable View]
        H[app/api/audit/route.ts<br/>Run Audit Engine]
        I[app/api/leads/route.ts<br/>Save Lead]
        J[app/api/share/route.ts<br/>Generate Share Token]
    end

    subgraph "Core Logic"
        K[src/lib/audit-engine.ts<br/>Pure Audit Functions]
        L[src/lib/pricing-data.ts<br/>Vendor Pricing Constants]
        M[src/lib/ai-summary.ts<br/>Anthropic API Wrapper]
    end

    subgraph "External Services"
        N[(Supabase<br/>Postgres DB)]
        O[Anthropic API<br/>claude-haiku-3]
        P[Resend<br/>Transactional Email]
        Q[Upstash Redis<br/>Rate Limiting]
    end

    A --> H
    H --> K
    H --> L
    H --> M
    H --> N
    C --> I
    I --> N
    I --> P
    D --> J
    J --> N
    G --> N
    M --> O
    H --> Q
```

---

## Stack Decisions

### Frontend: Next.js 14 (App Router) + TypeScript

**Why Next.js over plain React:**
- **SSR for shareable URLs** — Each `/audit/[token]` page is server-rendered with full OG/Twitter meta tags baked in. This is critical for virality: when a founder shares their audit on LinkedIn, it renders a rich card. A SPA can't do this without a separate meta-tags service.
- **API Routes built-in** — No need to deploy a separate Express/Fastify backend. `app/api/*` handles audit computation, lead storage, and email — all in one Vercel deployment.
- **Zero-config Vercel deployment** — Push to `main`, it's live. TypeScript, ESLint, Tailwind all detected automatically.
- **App Router file-based routing** — `app/audit/[token]/page.tsx` just works. No router config.

**Why TypeScript:** Pricing data, audit results, and tool configs are all structured data. TypeScript catches shape mismatches at compile time, not at 3am when a user hits a `Cannot read properties of undefined` error.

---

### Styling: Tailwind CSS + shadcn/ui

**Why Tailwind:**
- Design tokens in one place (`tailwind.config.ts`)
- Utility classes eliminate naming fatigue for one-off components
- PurgeCSS built-in = tiny production bundles

**Why shadcn/ui over plain Tailwind:**
- Components like `<Card>`, `<Badge>`, `<Dialog>` are pre-built to be accessible (ARIA) and unstyled enough to customize
- Copy-paste into `src/components/ui/` — no dependency lock-in
- Works perfectly with Tailwind and Next.js App Router (Server/Client component aware)

**Why NOT MUI/Chakra:** Heavy JS bundle, harder to customize, opinionated theming fights against custom design.

---

### Backend/DB: Supabase

**Why Supabase over Firebase/PlanetScale:**
- **Postgres under the hood** — Real SQL, JSONB columns for flexible `tools_data` and `results` storage, proper indexes
- **Free tier is generous** — 500MB DB, 2GB bandwidth, 50,000 MAU on Auth (unused here but available)
- **Row Level Security** — Can lock down lead data without writing custom auth middleware
- **Real-time** — If we add a "live audit" feature later, it's one line: `supabase.from('audits').on('INSERT', callback).subscribe()`

**Schema design decision:** `tools_data` and `results` are `JSONB` not normalized tables. Rationale: the tool list evolves (we add Windsurf, Gemini, etc.) and JSONB lets us store arbitrary tool configs without schema migrations every time we add a tool. Audit results are write-once, read-many — no need for relational queries.

---

### Email: Resend

**Why Resend over SendGrid/Mailchimp:**
- SendGrid's free tier requires business verification and has a clunky UI
- Resend is built for developers: one API key, one `fetch()` call, done
- React Email integration — can write email templates as JSX components
- 3,000 emails/month free — more than enough for lead-gen volumes

---

### AI Summary: Anthropic API (claude-haiku-3)

**Why claude-haiku-3 over GPT-3.5-turbo:**
- Assignment explicitly prefers Anthropic
- Haiku is the cheapest Anthropic model at $0.25/MTok input, $1.25/MTok output
- A 100-word summary prompt uses ~200 input tokens + ~150 output tokens ≈ **$0.0002 per audit** — essentially free
- Haiku is fast (~1-2s response) — acceptable for a non-streaming summary

**Graceful fallback:** If the Anthropic API is down or rate-limited, `ai-summary.ts` falls back to a template string built from the audit results. No user-facing errors.

---

### Rate Limiting: Upstash Redis

**Why:** Supabase doesn't have built-in rate limiting. Upstash Redis has a free serverless tier (10,000 commands/day) and a `@upstash/ratelimit` package that works perfectly with Next.js Edge Runtime. Simple IP-based limiting: 5 audits per IP per hour.

---

### Deployment: Vercel

**Why:** Zero-config Next.js deployment. Environment variables set in dashboard. Preview deployments on every PR. Analytics built-in. Free tier handles ~100GB bandwidth/month — more than sufficient for a launch.

---

### CI: GitHub Actions

Runs on every push to `main` and every PR:
1. `npm run lint` — ESLint check
2. `npm run type-check` — TypeScript compilation check
3. `npm test` — Vitest unit tests for audit engine

---

## Database Schema

```sql
-- Stores each completed audit
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tools_data JSONB NOT NULL,        -- Raw input: {tool, plan, spend, seats}[]
  results JSONB NOT NULL,           -- Audit output: {tool, recommendation, savings, reason}[]
  total_monthly_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_annual_savings DECIMAL(10,2) GENERATED ALWAYS AS (total_monthly_savings * 12) STORED,
  share_token VARCHAR(21) UNIQUE,   -- nanoid() for public URL
  ai_summary TEXT,                  -- Claude-generated summary paragraph
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores lead capture after audit shown
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
  email VARCHAR(320) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(255),
  team_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audits_share_token ON audits(share_token);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
CREATE INDEX idx_leads_email ON leads(email);
```

---

## Data Flow: Audit Request

```
1. User fills form → localStorage saves state
2. Submit → POST /api/audit
3. API route:
   a. Validates input (zod schema)
   b. Runs auditTool() for each tool → AuditResult[]
   c. Calls claude-haiku-3 for AI summary (with fallback)
   d. Saves to Supabase audits table
   e. Returns {auditId, results, totalSavings, aiSummary}
4. Client stores auditId in sessionStorage
5. Redirects to /audit?id={auditId}
6. Results page fetches audit by ID
7. User optionally submits email → POST /api/leads
8. User clicks "Share" → POST /api/share → returns /audit/{token} URL
```

---

## Security Decisions

| Threat | Mitigation |
|--------|-----------|
| Spam audits | Upstash rate limit: 5/IP/hour |
| Honeypot bots | Hidden `<input name="website">` field, reject if filled |
| Email harvesting | Leads table never exposed via public API |
| Secret leakage | `.env.local` in `.gitignore`, Vercel env vars for prod |
| XSS | Next.js auto-escapes JSX, no `dangerouslySetInnerHTML` |
| Injection | All DB calls via Supabase JS client (parameterized queries) |

---

## File Structure

```
credex-ai-audit/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing + Input Form
│   │   ├── audit/
│   │   │   ├── page.tsx                # Results page (private)
│   │   │   └── [token]/
│   │   │       └── page.tsx            # Public shareable view
│   │   └── api/
│   │       ├── audit/route.ts
│   │       ├── leads/route.ts
│   │       └── share/route.ts
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── ToolInputCard.tsx
│   │   ├── AuditResultCard.tsx
│   │   ├── SavingsHero.tsx
│   │   └── LeadCaptureForm.tsx
│   ├── lib/
│   │   ├── audit-engine.ts             # Core logic (pure functions)
│   │   ├── pricing-data.ts             # Vendor pricing constants
│   │   ├── ai-summary.ts              # Anthropic API wrapper
│   │   ├── supabase.ts                # Supabase client
│   │   └── validations.ts             # Zod schemas
│   └── types/
│       └── index.ts                    # Shared TypeScript types
├── ARCHITECTURE.md                     # This file
├── DEVLOG.md
├── PRICING_DATA.md
├── PROMPTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
├── METRICS.md
├── REFLECTION.md
├── TESTS.md
└── README.md
```

---

*Last updated: Day 1 of development — May 22, 2026*
