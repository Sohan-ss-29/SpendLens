# REFLECTION.md

## 1. The Hardest Bug — Share Link Showing "Audit Unavailable"

The most time-consuming bug was the shareable audit URL (`/audit/[token]`) returning "Audit Unavailable" for every locally-generated link, even when the data clearly existed in `.local-db.json`.

**Hypotheses I formed:**

1. *The token isn't being saved at all* — Ruled out immediately by checking `.local-db.json` directly. The `share_token` field existed on the audit record.
2. *The page is reading the wrong table* — This was the right track. I noticed the page reads from `shared_audits`, but `/api/leads` only wrote to the `audits` table. The token existed in the wrong place.
3. *The local DB mock has a bug* — Also partially true. Even after fixing the table issue, the mock's `insert()` didn't handle `await insert()` (without `.select().single()`) correctly. The `then` handler was resolving synchronously, not as a proper Promise.

**What I tried:**

First fix: Added a fallback to the page component to check `audits` table if `shared_audits` returns null. This half-worked — the link loaded but showed empty results, because the audit data shape didn't map cleanly.

Second fix: Rewrote `/api/leads/route.ts` to also insert a PII-stripped snapshot into `shared_audits` when generating the share token. This is architecturally cleaner: the share URL always reads from `shared_audits`, which is always populated at lead-capture time.

Third fix: Completely rewrote `local-db.ts` with a proper chainable query builder so that `insert().select().single()`, `await insert()`, and `select().eq().single()` all work correctly as they would against a real Supabase client.

The combined fix finally made everything work end-to-end. The core lesson: when you have two tables with the same token, you need to write to *both* at generation time, not try to read from one with a fallback to the other.

---

## 2. A Decision I Reversed Mid-Week

**Original decision:** Run the audit engine entirely on the client side (no API route).

My initial reasoning was speed — running pure JavaScript functions in the browser is instant. No network round-trip, no server cold start, no CORS issues. The audit engine is just pure functions, so why add a server?

**Why I reversed it:** Two reasons hit me on Day 3.

First: the Anthropic API call for the AI summary *has* to happen server-side. The API key cannot be exposed to the browser. Once I accepted that there had to be a server route for the AI summary, it made more sense to move the audit engine there too and have a single `/api/audit` endpoint return everything in one response.

Second: Supabase persistence. Saving the audit to the database for the shareable URL feature requires a server-side call anyway (or exposing the Supabase anon key to the client, which is acceptable for reads but feels wrong for writes with business logic attached).

The reversal cost about 2 hours of refactoring — moving the audit engine call from the form's submit handler to the API route. But the result was cleaner: the form just POSTs, the API returns the full result, and there's one source of truth for what the audit looks like.

---

## 3. What I Would Build in Week 2

**Priority 1: Real Supabase + Resend + Vercel deployment.** The local JSON DB and local email file system are great for development, but the submission needs live infrastructure. Week 2 day 1 would be: create Supabase project, run schema SQL, set environment variables on Vercel, test the full flow end-to-end in production.

**Priority 2: Lighthouse fixes.** The design currently scores well visually but I haven't run a production Lighthouse audit. Week 2 would include: image optimization (next/image for any assets), font subsetting, aria-label additions, focus ring visibility, and color contrast checks. Target: Performance ≥ 85, Accessibility ≥ 90.

**Priority 3: Team audit mode.** Two out of three user interviewees (Meghna and Hemanth) independently asked for a way to input multiple team members' tools and aggregate. This came up unprompted in separate conversations, which makes it a strong signal. The implementation would be: a "add team member" flow where each person inputs their own tools, and the results page shows individual + aggregate spend.

**Priority 4: PDF export.** Hemanth's team leads at hackathons and Meirambek as a solo founder both wanted something they could share asynchronously without requiring the recipient to click a link. A PDF of the audit results page — generated via `@react-pdf/renderer` or a headless screenshot — would cover this.

**Priority 5: More tools.** The current list of 8 covers the most common AI coding/chat tools but misses the AI research and productivity category. Perplexity Pro ($20/mo), Notion AI ($10/mo), Otter.ai ($17/mo), and Poe ($20/mo) all came up in user conversations. Adding 10 more tools would double the addressable user base.

---

## 4. How I Used AI Tools

**Tools used:** Claude Sonnet (primary), GitHub Copilot (in VS Code), occasional ChatGPT for quick lookups.

**What I used AI for:**
- Generating boilerplate: the initial `AuditForm.tsx` structure, the Supabase client setup, the email HTML template. Good for scaffolding, always needed review.
- TypeScript type gymnastics: the Zod `z.input<>` / `z.output<>` split pattern for react-hook-form was something Claude explained clearly after I described the error. I verified the fix myself.
- Writing entrepreneurial docs: GTM.md, ECONOMICS.md, METRICS.md. AI gave good starting frameworks; I added specifics from user interviews and my own reasoning about the Credex business model.
- Debugging ideas: described the share link bug to Claude and asked for hypotheses. It suggested the two-table problem immediately, which pointed me in the right direction.

**What I didn't trust AI with:**
- Audit logic rules. The per-tool pricing rules and the cross-tool redundancy logic needed to be correct and defensible. I wrote those myself by reading every vendor's pricing page and reasoning through the rules. AI tends to confidently generate plausible-looking but wrong pricing numbers.
- User interview analysis. The insights from Meirambek, Meghna, and Hemanth are from real conversations — I summarized them myself.

**One time AI was wrong:** When I asked Claude to write the Cursor pricing rules, it suggested Cursor Business costs $50/seat/month. The actual price is $40/seat/month (as of submission week). I caught this because I had PRICING_DATA.md open with the official Cursor pricing page sourced. Always verify AI-generated numbers against the actual source.

---

## 5. Self-Ratings

| Dimension | Rating | Reason |
|-----------|--------|--------|
| **Discipline** | 7/10 | Committed across 5+ distinct days, devlog has honest entries. But Days 2 and 3 both landed on May 23 — I built Day 3 content the same day as Day 2 rather than spacing them. |
| **Code quality** | 7/10 | TypeScript types are used well, pure functions for the audit engine make testing easy, abstractions are sensible. The local DB mock (`local-db.ts`) is a bit hacky — it exists only because we don't have real Supabase credentials for local dev. |
| **Design sense** | 8/10 | The dark luxury minimalist design with Outfit font, gradient accents, and glassmorphism cards is distinctive and premium. The results page specifically is screenshot-worthy. Accessibility still needs a Lighthouse pass. |
| **Problem-solving** | 8/10 | Debugged the share link bug systematically — formed hypotheses, eliminated them one by one, found the root cause (wrong table) and fixed it architecturally rather than with a workaround. |
| **Entrepreneurial thinking** | 7/10 | Talked to 3 real users, wrote substantive GTM/ECONOMICS/METRICS docs, thought about the Credex business model. The user interview with Meirambek (VIDI founder) gave a genuinely new insight about API-first founders as a distinct ICP. Could have gone deeper on the $1M ARR path math. |
