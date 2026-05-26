# SpendLens — AI Spend Audit Tool

> **"Mint for AI tool costs"** — a free web app where startup founders and engineering managers audit their AI subscriptions in 2 minutes and see exactly where they're overspending.

[![CI](https://github.com/Sohan-ss-29/SpendLens/actions/workflows/ci.yml/badge.svg)](https://github.com/Sohan-ss-29/SpendLens/actions)
[![Live](https://img.shields.io/badge/Live-spend--lens--b6oy.vercel.app-7c3aed?style=flat)](https://spend-lens-b6oy.vercel.app)

---

## 🚀 Live Demo

**[https://spend-lens-b6oy.vercel.app](https://spend-lens-b6oy.vercel.app)** ← Try the full flow here

---

## What It Does (End-to-End)

1. **Input** your team's AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, OpenAI API, Anthropic API) — plan, seats, monthly spend
2. **Audit Engine** checks: plan fit for team size, cheaper same-vendor alternatives, cross-vendor switches (e.g., "you have both Cursor Pro and GitHub Copilot — that's redundant for a coding team"), and Credex credit opportunities
3. **Results Page** shows: total monthly/annual savings hero, per-tool recommendations, AI-written 100-word summary (Claude Haiku)
4. **Lead Capture** (optional, shown *after* results — spec requirement): email for permanent audit link + Credex follow-up for high-savings cases
5. **Shareable URL**: public `/audit/[token]` with Open Graph + Twitter Card tags — the viral loop

No login. No account. No credit card. 2 minutes.

---

## Screenshots

> *Run the audit at the live URL and screenshot your results — the savings hero number is the shareable moment.*

**Audit Input Form** — Tool picker grid with 8 AI tools, auto-calculates spend from plan × seats, localStorage persistence across reloads.

**Results Page** — Big savings number, per-tool breakdown cards with badges (✓ Optimal / ↓ Downgrade / ⚠ Redundant), AI summary panel.

**Shareable URL** — `/audit/[token]` public page strips PII (no email/company shown), displays tools + savings, OG tags for clean LinkedIn/Twitter previews.

---

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js (App Router) + TypeScript | SSR for OG tags; `generateMetadata()` is clean |
| Styling | Vanilla CSS with custom design system | Full control, no dependency on component library opinions |
| Database | Supabase (Postgres + JSONB) | Free tier, flexible schema, Row Level Security |
| Email | Resend | Simplest transactional email DX; free tier covers launch |
| AI Summary | Anthropic claude-3-5-haiku-20241022 | Assignment preference; graceful fallback if API is down |
| Rate Limiting | In-memory sliding window (Upstash Redis upgrade path) | Works locally; env var swap for production |
| Deployment | Vercel | Zero-config Next.js; instant preview deploys |
| CI | GitHub Actions | Type-check + tests + build on every push to main |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full reasoning and Mermaid system diagram.

---

## Quickstart

### Prerequisites
- Node.js 18+
- npm 9+

**Works locally without any API keys** — uses a local JSON file database (`.local-db.json`) and saves emails to `.local-emails/` directory.

### 1. Clone and install

```bash
git clone https://github.com/Sohan-ss-29/SpendLens.git
cd SpendLens
# or: git clone https://github.com/Sohan-ss-29/SpendLens.git credex-ai-audit && cd credex-ai-audit
npm install
```

### 2. (Optional) Set up environment variables for real integrations

```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY
```

Without these, the app uses local fallbacks — audit engine runs fully, AI summary falls back to a template, and data is saved locally.

### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Run tests

```bash
npm test
# 37 tests, ~520ms
```

### 5. Build check

```bash
npm run build
# Must pass clean — checked by CI on every push
```

---

## Key Decisions

1. **JSONB over normalized tables for audit data** — Tool list evolves frequently (new vendors, new plans). JSONB lets us store arbitrary tool arrays without schema migrations. We never query by individual tool — only by `audit_id` — so there's no join penalty. See [ARCHITECTURE.md](./ARCHITECTURE.md).

2. **nanoid(21) over UUID for share tokens** — UUIDs are 36 chars with hyphens. nanoid(21) is URL-safe, 21 chars, and has equivalent collision resistance. `/audit/V1StGXR8_Z5jdHi6B-myT` is a much better shareable URL than a UUID. Changing this later would require a migration; chose correctly upfront.

3. **Audit engine as pure functions, not an LLM** — The spec says "knowing when not to use AI is part of the test." The audit logic is deterministic, needs to be defensible to a finance person, and must be testable. Hardcoded rules with sourced pricing data (PRICING_DATA.md) is the right architecture. LLM is used only for the 100-word narrative summary where imprecision is acceptable.

4. **Lead capture shown after results, not before** — The spec is explicit. But there's also a product reason: showing value before asking for email dramatically increases conversion. A user who sees "$340/month savings" is far more motivated to give their email than one who sees a form before any results.

5. **Local JSON fallback instead of requiring API keys** — Requiring every reviewer to set up Supabase, Resend, and Anthropic accounts to run locally would kill the "quick start" experience. The local JSON DB and `.local-emails/` directory make the full flow demonstrable without any external services. The production app uses real Supabase + Resend when env vars are present.

---

## Required Files

| File | Status |
|------|--------|
| README.md | ✅ |
| ARCHITECTURE.md | ✅ |
| DEVLOG.md | ✅ — 7 days |
| REFLECTION.md | ✅ |
| TESTS.md | ✅ |
| PRICING_DATA.md | ✅ |
| PROMPTS.md | ✅ |
| GTM.md | ✅ |
| ECONOMICS.md | ✅ |
| USER_INTERVIEWS.md | ✅ |
| LANDING_COPY.md | ✅ |
| METRICS.md | ✅ |
| .github/workflows/ci.yml | ✅ |

---

## License

MIT — built for the Credex Web Development Intern assignment (Round 1).
