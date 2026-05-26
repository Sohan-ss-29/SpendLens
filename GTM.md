# GTM.md — Go-To-Market Strategy

## Target User (ICP — Ideal Customer Profile)

**Primary:** CTO or Engineering Manager at a seed-stage or Series A SaaS startup (5–30 people) who personally manages vendor subscriptions on a company card. They feel the burn rate tightening and suspect they're paying for tools multiple people are duplicating — but haven't had time to audit it.

**Secondary:** Indie hacker or solo founder running a bootstrapped product. They're often on multiple AI coding tools simultaneously (Cursor + Windsurf + Claude + GitHub Copilot) because they chased each product launch without cancelling the last.

**What they feel:**
- "I'm pretty sure we're paying for Cursor AND Copilot AND Windsurf for some devs."
- "Our OpenAI bill doubled last month and I don't know why."
- "I should probably clean this up but I don't have time to compare every plan."

**What they *don't* want:** A sales call. A demo request. A 14-day trial with a credit card.

---

## Where They Hang Out (Zero-Budget Acquisition Channels)

| Channel | Tactic | Expected Volume |
|---------|--------|----------------|
| **r/SaaS** | Post "We built a free tool to audit AI subscriptions" with a real screenshot of savings | 500–2k views/post |
| **r/startups** | Comment on "AI tool cost" threads with a link | 200–800 views |
| **r/ExperiencedDevs** | Post "How I audited my team's AI spend — here's what surprised us" | 300–1k |
| **Indie Hackers** | Milestone post: "Built in 7 days: AI spend auditor for solo founders" | 300–800 |
| **X (Twitter/ex-Twitter)** | Tag thread: "Found out we were paying $340/mo for 3 AI coding tools that 80% overlap. Free audit → [link]" | Viral potential |
| **Hacker News Show HN** | "Show HN: SpendLens – Free AI tool spend auditor for startups" | 200–5k if lands on front page |
| **Product Hunt** | Launch on a Wednesday 12:01am PST | 200–800 upvotes if warm community |
| **Slack/Discord** | Founder Slack groups (e.g., Failory, Small Bets, Lenny's) | 100–400 targeted |
| **LinkedIn** | "I audited our AI spend in 2 minutes and found $X/month in waste. Here's how →" | 500–5k impressions |
| **College network** | Share in CS WhatsApp groups, department Discords | 50–200 for IIT/NIT-tier |

---

## Path to First 100 Users — $0 Budget

### Week 1 — Seed (Days 1–7)
- [ ] Post the tool on Reddit (r/SaaS, r/startups) with a real audit screenshot
- [ ] Write a 1-tweet thread on X showing a real $300/mo saving finding
- [ ] Post a "Day 1 of launch" on Indie Hackers
- [ ] DM 10 founders on LinkedIn with: "Built a free tool that took me 2 min — found I was wasting $210/mo on AI subscriptions. Thought it might be useful for you: [link]"
- [ ] Share in college CS/entrepreneurship groups

### Week 2 — Growth loop activation (Days 8–14)
- The shareable link is the key growth loop: every user who submits their email gets a `/audit/[token]` URL. When shared on LinkedIn ("We found $X in AI savings"), it becomes a free ad.
- Target: 50 shares → 10 new users per share = 500 impressions
- Post on Product Hunt
- Submit to "free tools" newsletters (TLDR, The Rundown AI)

### Week 3 — Compounding (Days 15–21)
- Retarget r/SaaS with a follow-up post: "30 days later: here's what 200 founders found when they audited their AI spend"
- Launch Show HN thread

**Conversion funnel:**
```
100 visitors → 60 complete audit → 25 submit email (25% CVR on gate)
→ 8 share link (30% share rate of email captors)
→ 8 shares × 200 average reach = 1,600 new visitors → 15 new sign-ups
```

---

## Positioning Statement

> "SpendLens is the free AI spend auditor for startup founders — not consultants, not software vendors with a quota to fill. You get an instant, honest breakdown of exactly where your team is overspending on AI tools, with specific downgrade and switch recommendations, in under 2 minutes."

---

## Differentiation from Competitors

| What exists | Problem | SpendLens difference |
|------------|---------|---------------------|
| Manual spreadsheet audit | Takes hours; goes stale | Automated, instant |
| Vendor-hosted "calculators" | Vendor-biased; always recommends their own plan | Credex is cross-vendor and honest |
| Enterprise SaaS management tools (Torii, Zylo) | $10k+/yr minimum; SMB-hostile | Free forever for SMBs |
| ChatGPT / manual research | Requires knowing what to search for | Proactive recommendations |
