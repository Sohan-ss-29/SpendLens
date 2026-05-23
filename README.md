# AI Spend Audit Tool

> **Mint.com for AI tool costs** — a free web app where startup founders and engineering managers audit their AI subscriptions and see exactly where they're overspending.

[![CI](https://github.com/your-username/credex-ai-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/credex-ai-audit/actions)
[![Live Demo](https://img.shields.io/badge/Live-Demo-7c3aed?style=flat)](https://credex-ai-audit.vercel.app)

---

## 🚀 Live Demo

**[credex-ai-audit.vercel.app](https://credex-ai-audit.vercel.app)** ← Try it here

---

## What It Does

1. **Input** your team's AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, and API usage)
2. **Audit Engine** checks: plan fit for team size, cheaper same-vendor alternatives, cross-vendor switches, Credex credit opportunities
3. **Results Page** shows: total monthly/annual savings, per-tool recommendations, AI-written summary
4. **Lead Capture** (optional, shown after results): email for Credex follow-up
5. **Shareable URL**: public `/audit/[token]` link with OG tags for LinkedIn/Twitter sharing

---


## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR for OG tags, file routing, built-in API routes |
| Styling | Tailwind CSS + shadcn/ui | Fast, accessible, fully customizable |
| Database | Supabase (Postgres) | Free tier, JSONB for flexible audit storage |
| Email | Resend | Simplest transactional email, great DX |
| AI Summary | Anthropic claude-haiku-3 | Assignment preference, ~$0.0002/audit |
| Rate Limiting | Upstash Redis | Serverless, free tier, IP-based limiting |
| Deployment | Vercel | Zero-config Next.js, instant deploys |
| CI | GitHub Actions | Lint + type-check + tests on every push |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full reasoning.

---

## Quickstart

### Prerequisites
- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key
- A [Resend](https://resend.com) API key
- An [Upstash](https://upstash.com) Redis database

### 1. Clone and install

```bash
git clone https://github.com/your-username/credex-ai-audit.git
cd credex-ai-audit
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
# Edit .env.local with your keys
```

### 3. Set up Supabase

Run the SQL in `src/lib/supabase.ts` (in the comments) in your Supabase SQL Editor.

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Run tests

```bash
npm test
```

---

## Key Technical Decisions

1. **JSONB over normalized tables** for audit data — tool list evolves frequently, queries never need per-tool joins. See [ARCHITECTURE.md](./ARCHITECTURE.md#backend-db-supabase).

2. **nanoid over UUID for share tokens** — 21-char URL-safe strings are cleaner than 36-char UUIDs in shareable URLs (e.g., `/audit/V1StGXR8_Z5jdHi6B-myT`).

3. **App Router over Pages Router** — `generateMetadata()` for OG tags on shareable URLs is clean and first-class in App Router. Pages Router `_document.js` approach was too hacky.

4. **Graceful AI summary fallback** — If Anthropic API fails, the summary falls back to a template string. Users never see an error.

5. **Lead capture shown after results** — Spec is explicit: never gate results behind email. This increases conversion because users see value before committing.

---

## Required Files

| File | Status |
|------|--------|
| README.md | ✅ |
| ARCHITECTURE.md | ✅ |
| DEVLOG.md | ✅ (Day 1 complete) |
| REFLECTION.md | 🔲 Day 7 |
| TESTS.md | 🔲 Day 3+ |
| PRICING_DATA.md | 🔲 Day 3 |
| PROMPTS.md | 🔲 Day 4 |
| GTM.md | 🔲 Day 6 |
| ECONOMICS.md | 🔲 Day 6 |
| USER_INTERVIEWS.md | 🔲 Day 6 |
| LANDING_COPY.md | 🔲 Day 6 |
| METRICS.md | 🔲 Day 6 |
| .github/workflows/ci.yml | ✅ |

---

## Development Log

See [DEVLOG.md](./DEVLOG.md) for daily entries.

---

## License

MIT — built for the Credex entrepreneurial assignment.
