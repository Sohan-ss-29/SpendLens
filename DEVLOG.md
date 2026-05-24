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

## Day 3 — May 23, 2026 — Audit Engine + Tests

**Goal:** Complete the full audit engine, write comprehensive PRICING_DATA.md, and build a thorough test suite.

### What I built today

- **Rewrote `src/lib/audit-engine.ts`** — full rule set for all 8 tools:
  - `auditTool()` → per-tool analysis using helper functions `optimal()` and `downgrade()`
  - Per-tool rules: Cursor (4 rules), Copilot (2 rules), Claude (4 rules), ChatGPT (3 rules), Gemini (2 rules), Windsurf (3 rules)
  - Usage-based path for Anthropic API and OpenAI API (no seat logic, just spend monitoring)
  - Credex opportunity flagging: API spend > $100/mo → flag, > $200/mo → prominent recommendation
  - Generic fallback rule: find cheaper same-vendor tier when no specific rule matches
  - $5 threshold on generic rule to avoid noisy micro-recommendations
- **Cross-tool rules in `runAudit()`:**
  1. Cursor Pro+ + Copilot → coding teams: flag Copilot as redundant (most expensive redundancy)
  2. Claude + ChatGPT both paid + non-coding use case → suggest consolidating to one LLM
  3. Cursor + Windsurf both paid + coding → flag as duplicate AI IDEs
- **Wrote `PRICING_DATA.md`** — every vendor pricing page cited with URL + date, cross-tool scenario table with exact savings
- **37 unit tests** in `src/__tests__/audit-engine.test.ts` — all passing:
  - Shape invariants (annualSavings = 12×, never negative, etc.)
  - All 8 tools × multiple scenarios
  - Edge cases: free plans, solo users, minimum seat requirements, max plans
  - Cross-tool redundancy detection for all 3 rules
  - 8-tool max-load test

### Test results
```
✓ 37 tests pass
✓ 0 tests fail
Duration: 644ms
```

### Decisions made

**Why `optimal()` and `downgrade()` helpers:**
The engine originally had 6 fields to set for every return. With 20+ return paths, inconsistency crept in (some paths missing `credexOpportunity`, etc.). Extracting helpers ensures every result has the exact same shape and the math (`annualSavings = monthlySavings × 12`) is guaranteed by construction.

**Why $5 threshold on generic downgrade rule:**
A $2/month savings suggestion is noise — it would confuse users and erode trust in the tool. The $5 minimum prevents silly recommendations like "downgrade from $22/seat to $20/seat for 1 seat" when the numbers are close.

**On the Cursor/Copilot Business plan decision:**
Both Cursor Business ($40/seat) and Copilot Business ($19/seat) flag as downgradeable for teams of 5. This is the right call: admin dashboard features (policy enforcement, centralized billing, audit logs) are genuinely valuable only for orgs with 20+ engineers and compliance requirements. A 5-person startup doesn't need them and saves $20–29/seat/mo by switching.

**Why use a `minSeats` guard on the generic rule:**
Without the guard, team plans with no `minSeats` defined would always trigger the generic cheaperTier search, even when the user is correctly on a Team plan. The guard: `if (isTeamPlan && currentTier?.minSeats && tool.seats >= currentTier.minSeats) return false` correctly prevents downgrade suggestions when the user meets the plan requirements.

### Blockers/surprises

- Generic cheaperTier rule over-triggered initially: for any business plan, it would find individual/pro as cheaper and suggest downgrade regardless of team size. Fixed by adding `isTeamPlan` guard.
- Two test cases had to be corrected after verifying actual business logic: Cursor Business and Copilot Business for 5-person teams *should* suggest downgrade — the original tests assumed "team plan = optimal" which isn't always true.

### Tomorrow (Day 5)

- Build Lead Capture flow
- Generate Shareable URLs
- Add email integration (Resend)

---

## Day 4 — May 23, 2026 — API, AI Summary & Supabase

**Goal:** Connect the frontend to a real backend API, add Supabase persistence, and integrate the Anthropic API for AI-generated summaries.

### What I built today

- **API Route (`/api/audit`)**:
  - Wired up `src/app/api/audit/route.ts` to accept POST requests from the form.
  - Added full request validation using Zod.
  - Integrated `runAudit` engine on the backend.
  - Implemented AI summary generation using the `@anthropic-ai/sdk` and `claude-3-5-haiku-20241022` (via a safe fallback mechanism if keys are missing).
  - Added Supabase insertion logic to save the audit result to an `audits` table and return a unique UUID.
- **Frontend Updates**:
  - Updated `AuditForm.tsx` to asynchronously POST to the new API instead of running logic entirely client-side.
  - Handled loading states correctly via React Hook Form (`isSubmitting`).
  - Polished `ResultsPage` (`src/app/audit/results/page.tsx`) to display the new AI Summary section.
  - Added a clean loading skeleton to the results page while it pulls data from `sessionStorage`.
- **Infrastructure Fixes**:
  - Fixed a Next.js build crash caused by Supabase config by adding safe fallback values to `process.env` lookups in `src/lib/supabase.ts`.

### Decisions made
- Used a resilient API approach: If Supabase keys are missing locally, it logs a warning but still returns the generated audit and a mocked UUID so development isn't blocked.
- Kept `sessionStorage` as the primary mechanism for passing the result to the `/audit/results` page for instant transitions, while still securing the DB persistence on the backend.

### Tomorrow (Day 5)

- Build lead capture mechanics (email gating for full results if requested).
- Implement dynamic routing for shareable audit URLs (`/audit/[id]`).
- Set up Resend for email notifications when a high-value lead completes an audit.

---

## Day 4 — [DATE] — Results Page + AI Summary

*See Day 4 entry above (the detailed entry is the second Day 4 block — completed May 23).*

---

## Day 5 — May 24, 2026 — Lead Capture + Shareable URLs (Features 5 & 6)

**Hours worked:** 6

**What I did:**

- **`/api/leads` route** — Full implementation:
  - Zod schema validation on email (required), company name, role, team size (all optional)
  - IP-based rate limiting: 5 requests/min per IP (in-memory fallback, Upstash Redis when env var present)
  - Honeypot field: `<input name="website">` hidden via CSS+aria. Bots fill it, humans don't see it. If non-empty, silently return 200 and drop the lead.
  - Inserts to Supabase `leads` table (email, company_name, role, team_size, audit_id, share_token, is_high_value)
  - Updates the `audits` row with lead_email + share_token
  - Sends Resend confirmation email with shareable link, personalized for high-value (>$500/mo) vs. standard cases
- **`/api/share` route** — Creates a PII-stripped snapshot in `shared_audits` Supabase table, returns a nanoid(21) token
- **`src/lib/email.ts`** — Full Resend integration with HTML email template. Graceful fallback (logs a warning and returns false) when RESEND_API_KEY is not set
- **`src/lib/rate-limit.ts`** — Sliding-window rate limiter. In-memory by default; auto-upgrades to Upstash Redis when env vars are present. Same interface either way — clean abstraction
- **`LeadCaptureForm` component** — Shown after audit results (never before, per spec). Fields: email (required), company name, role, team size (optional). Honeypot field hidden via CSS + aria-hidden. Post-submit shows share link with one-click copy.
- **`/audit/results` page** — Integrated `LeadCaptureForm` below the tool breakdown. Wires `auditId` from the API response. Share button in header appears once user submits email.
- **`/audit/[token]` page** — Full public shareable view:
  - `generateMetadata()` fetches the audit from Supabase and generates rich OG + Twitter Card meta tags dynamically
  - Displays all tool savings data, AI summary, and a viral CTA to run your own audit
  - Zero PII — email and company name never stored in `shared_audits`
  - Handles 404 (expired/invalid token) gracefully

**What I learned:**

- Zod v4 `transform().pipe()` creates a type where the input and output shapes differ — `react-hook-form`'s `Resolver` type requires input and output to match, causing a TS error. The fix: separate the raw schema from the transform, use `z.input<>` for `useForm<>` and cast the resolver. Tracked in REFLECTION.md as the hardest bug.
- Next.js App Router's `generateMetadata()` is async-safe — can `await` a Supabase query inside it. The resulting HTML `<meta>` tags are fully server-rendered before the response is sent, which is what makes Twitter/LinkedIn link previews work correctly.
- Honeypot fields need both CSS hiding (`position: absolute; clip: rect(0,0,0,0)`) AND `tabIndex={-1}` + `autoComplete="off"` to pass accessibility audits and prevent autofill.

**Blockers / what I'm stuck on:**

- TypeScript type mismatch between Zod's transformed output type and react-hook-form's generic resolver — resolved with a `z.input<>` / `z.output<>` split approach.
- `shared_audits` is a new Supabase table not in the original schema — added the SQL below. Needs to be run in Supabase Dashboard before the share feature works in production.

**Plan for tomorrow (Day 6):**

- Run Lighthouse, fix until Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90
- Mobile responsive pass
- Write all entrepreneurial docs: GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md
- Conduct 3 user interviews (already scheduled — two college network connections + one indie hacker post)
- Write USER_INTERVIEWS.md with real quotes

---

## Day 6 — [DATE] — Polish + Entrepreneurial Docs

*Entry pending — to be written during Day 6 work.*

---

## Day 7 — [DATE] — Final Polish + Submission

*Entry pending — to be written during Day 7 work.*
