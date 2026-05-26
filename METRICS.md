# METRICS.md — Measurement Plan

## North Star Metric

**"Audits completed with email captured"**

This is the single number that matters most. It means:
1. A user found value (completed the audit — got their savings number)
2. A user trusted us enough to give us contact information
3. Credex has a qualified lead they can follow up with

It is **not** raw visitors (vanity) or raw audits (incomplete value delivery) — it specifically captures both product value AND commercial intent.

**Target:** 25 per day by Month 3.

---

## 3 Input Metrics (Levers That Drive the North Star)

### 1. Audit Completion Rate
**Definition:** % of users who land on `/audit/new` and successfully reach `/audit/results`
**Current baseline:** Unknown (instrumentation needed)
**Target:** ≥ 60%
**Why it matters:** If users drop off during tool selection, the product is too confusing or the tool list is missing what they use.
**Lever:** Simplify the form; add tool autocomplete; reduce required fields.

### 2. Email Capture Rate (of Completers)
**Definition:** % of users who complete the audit AND submit the lead capture form
**Current baseline:** Unknown
**Target:** ≥ 30%
**Why it matters:** This is the conversion from anonymous user to qualified lead. Low rate = email gate feels intrusive or the value shown isn't compelling enough.
**Lever:** A/B test headline copy on the email form; test showing the share link as a hook before the form.

### 3. Viral Coefficient (Share Rate)
**Definition:** % of email capturers who share their audit link (on LinkedIn, X, or with their team)
**Current baseline:** Unknown
**Target:** ≥ 20% (meaning 1 in 5 email users shares)
**Why it matters:** At 20% share rate with even modest reach per share (200 views), the product grows without paid spend. Below 10%, growth depends entirely on outbound.
**Lever:** Make the share link more prominent; add a "Share with your team" nudge immediately after email capture.

---

## Instrumentation Plan

### Phase 1 — What to track immediately (no-code / lightweight)
```
Event                          | Tool        | Data captured
-------------------------------|-------------|-----------------------------
Page view: /                   | Vercel Analytics | UTM source, referrer
Page view: /audit/new          | Vercel Analytics | Drop-off from landing page
Form submit: /api/audit        | Custom log  | teamSize, useCase, toolCount
Page view: /audit/results      | Vercel Analytics | Tracks audit completion
Form submit: /api/leads        | Custom log  | email domain, savings amount
Share link click: /audit/[id]  | Vercel Analytics | Unique views per share token
```

### Phase 2 — Add analytics SDK (Month 2)
Integrate PostHog (free tier, self-hostable) for:
- **Funnel analysis:** Landing → Audit start → Results → Email capture → Share
- **Session replays:** Understand where users hesitate or re-read
- **Feature flags:** A/B test headline and CTA copy without deployments

### Phase 3 — Revenue attribution (Month 3+)
- Tag email submitters by UTM source to attribute Credex conversions to acquisition channels
- Track: `audit_completed_at` → `credex_consult_booked_at` → `credex_paid_at` for full funnel visibility

---

## Pivot Trigger

**If after 60 days and 1,000+ completed audits:**
- Email capture rate < 10% → The email gate feels like a paywall; remove it and collect email via post-results nudge instead
- Audit completion rate < 30% → The tool selection UI is too complicated; replace tool picker with a bulk-upload CSV option
- Viral coefficient < 5% → The share URL isn't compelling enough; add a dynamic savings badge/OG image to the shared page
- Zero Credex conversions → The SpendLens → Credex hand-off is broken; redesign the email CTA to be more specific about what Credex offers

**When to NOT pivot:**
- Low traffic but high email capture rate (> 35%) → Distribution problem, not product problem. Double down on GTM.
- High completion rate but low email rate → Value clearly delivered but trust not established; add social proof and privacy signals to form.
