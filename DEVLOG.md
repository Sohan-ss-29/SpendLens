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

## Day 2 — [DATE] — Spend Input Form

*Entry pending — to be written during Day 2 work.*

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
