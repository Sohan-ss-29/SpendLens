# DEVLOG — AI Spend Audit Tool (Credex)

> Daily engineering journal. One entry per day, written on the day.

---

## Day 1 — May 22, 2026 — Setup & Architecture

**Goal:** Get the project skeleton up, make decisions, write them down.

### What I built today

- Initialized Next.js 14 (App Router) + TypeScript project with Tailwind CSS and ESLint
- Set up shadcn/ui component library (Button, Card, Badge, Input, Label, Dialog components)
- Wrote `ARCHITECTURE.md` with full Mermaid system diagram and documented every stack decision with reasoning
- Set up `.github/workflows/ci.yml` — runs lint, type-check, and tests on every push/PR
- Created the Supabase schema (SQL in `ARCHITECTURE.md`) for `audits` and `leads` tables
- Set up `.env.local.example` with all required environment variable keys (no secrets committed)
- Set up `tailwind.config.ts` with custom design tokens (brand colors, dark mode)
- Created base TypeScript types in `src/types/index.ts`
- Scaffolded folder structure for all Day 2–7 features

### Decisions made

**Why JSONB for tools_data and results:**
Originally considered a normalized `audit_tools` table with one row per tool per audit. Rejected because: (a) tool list evolves frequently, (b) we never query by individual tool, only by audit_id, (c) JSONB is simpler and the query patterns don't require joins.

**Why nanoid for share tokens (not UUID):**
UUIDs are 36 chars and ugly in URLs. nanoid(21) gives 21-char URL-safe strings with equivalent collision resistance. `yourapp.com/audit/V1StGXR8_Z5jdHi6B-myT` looks much cleaner than `yourapp.com/audit/3f2504e0-4f89-11d3-9a0c-0305e82c3301`.

**Why App Router over Pages Router:**
Tried Pages Router for two hours. generateMetadata() for OG tags is only clean in App Router. The shareable URL feature *needs* server-side OG tags. Pages Router `_document.js` approach is too hacky. App Router is the right call.

### Blockers/surprises

- `create-next-app` now installs Next.js 15 by default (latest at time of writing). Locked to `next@14.2.x` in `package.json` for stability with the App Router patterns documented here.
- shadcn/ui `init` command requires interactive prompts. Worked around by manually copying component source files.

### Tomorrow (Day 2)

Build the multi-tool spend input form. 8 tools × (plan + spend + seats) = complex state management. Will use `react-hook-form` with `useFieldArray` for the dynamic tool list. localStorage persistence is important — founders tab-hop and lose their work.

---

## Day 2 — May 23, 2026 — Spend Input Form (MVP Feature 1)

**Goal:** Build the full multi-tool spend input form with all 8 AI tools, validation, and localStorage persistence.

### What I built today

- Built `src/components/AuditForm.tsx` — full client-side form using `react-hook-form` + `useFieldArray`
- Implemented `zodResolver` integration for real-time field validation with specific error messages
- Built dynamic tool picker grid — click to add/remove tools, max 8, prevents duplicates
- Each tool card has: plan selector (auto-populates spend based on price × seats), monthly spend input, seats input
- Seats × plan price auto-calculation: changing seats auto-updates the monthly spend field
- Plan change auto-calculation: switching plan auto-recalculates spend for current seats
- localStorage persistence: form state saves on every change, reloads on mount — survives tab switches and refreshes
- Hid seats input for pure usage-based tools (Anthropic API, OpenAI API direct)
- Shows minimum seat warnings for plans with seat requirements (Claude Team min 5, etc.)
- Built `src/app/audit/results/page.tsx` — client-side results reader from sessionStorage
- Results page shows: big savings hero number, per-tool breakdown cards, Credex CTA when savings > $500/mo
- Written full audit engine (`src/lib/audit-engine.ts`) with real business rules (early for Day 3)
- Written 10 unit tests in `src/__tests__/audit-engine.test.ts`

### Decisions made

**Why useFieldArray over a custom state array:**
`react-hook-form`'s `useFieldArray` gives us free field registration, error state, and re-render optimization. Rolling our own with `useState` would require manually wiring validation — 2x the code for no gain.

**Why sessionStorage for audit results (not URL params):**
Audit results can be several KB of JSON (8 tools × results object). URL params max out at ~2KB in most browsers. sessionStorage is clean, survives page refresh within a tab, and clears when the user closes — which is the right behavior. Day 5 will add real Supabase persistence + shareable URLs.

**Why auto-calculate spend from seats:**
Founders often don't know their exact monthly spend — they know their plan and seat count. Auto-calculating from official pricing removes friction. They can override if their billing differs (e.g., annual discount).

**Why show min-seat warnings inline (not on submit):**
If a user picks Claude Team with 2 seats, they should see immediately that the plan requires 5 seats minimum. Waiting until submit to tell them is frustrating UX.

### Blockers/surprises

- Next.js 16 (installed by default) uses async `params` in dynamic route handlers. Updated `[token]/page.tsx` to use `await params` pattern.
- Tailwind v4 ships with `@import "tailwindcss"` not `@tailwind base/components/utilities`. Updated globals.css accordingly.
- `metadataBase` warning in dev: added to layout.tsx to resolve OG image URL resolution.

### Tomorrow (Day 3)

- Full audit engine with all per-tool rules (already started today)
- 5+ tests covering edge cases: 1 user, max plan already optimal, API-only users, cross-tool redundancy
- Write `PRICING_DATA.md` with all vendor URLs cited
- Connect form submission to real API route (`/api/audit`)
- Save results to Supabase

---

## Day 3 — [DATE] — Audit Engine + Tests

*Entry pending — to be written during Day 3 work.*

---

## Day 4 — [DATE] — Results Page + AI Summary

*Entry pending — to be written during Day 4 work.*

---

## Day 5 — [DATE] — Lead Capture + Shareable URLs

*Entry pending — to be written during Day 5 work.*

---

## Day 6 — [DATE] — Polish + Entrepreneurial Docs

*Entry pending — to be written during Day 6 work.*

---

## Day 7 — [DATE] — Final Polish + Submission

*Entry pending — to be written during Day 7 work.*
