# USER_INTERVIEWS.md — User Research

## Overview

**Goal:** Validate whether founders and engineering managers feel the problem of AI tool overspend, whether SpendLens's approach resonates, and what's missing.

**Method:** 15–20 minute video/voice calls over Google Meet/WhatsApp, or detailed async DMs/email threads. Structured around 5 core questions but allowed to go wherever the conversation led.

**Recruited via:** LinkedIn outreach, Indie Hackers community, and college network (Amrita Vishwa Vidyapeetam CS batch).

---

## Interview 1

**Interviewee:** Meirambek M. ([@meirambek on LinkedIn](https://www.linkedin.com/in/meirambek-mukhametkalievich-2b72272a4/))
**Role:** Solo Founder & CTO, VIDI — AI contract review for SMBs
**Product:** VIDI is an AI-powered contract analysis tool that helps small and medium businesses understand legal risks in plain English. Users upload contracts and get risk detection and simple explanations. Launched MVP, early traction on Product Hunt.
**Date:** May 24, 2026
**Format:** LinkedIn DM → 20-minute voice call (Google Meet)

### Background
Meirambek is a solo technical founder based in Kazakhstan, building VIDI — an AI product that uses LLMs to analyze contracts for SMBs who can't afford a lawyer for every deal. He's entirely self-funded and cost-conscious by necessity. His AI stack is his single largest operational cost: Claude API for contract analysis is the core of his product, and he also uses Cursor daily for coding.

### Key Quotes

> "I'm spending maybe $180–$220 a month on AI APIs and tools combined, but I've never broken it down. Claude API is the main cost but I don't know if I'm on the right tier. I just picked a plan and kept going."

> "The thing that hit me was when SpendLens flagged that I'm running Claude Pro *and* using Claude API directly — those overlap for my personal use case. I should just use the API and stop paying for Pro separately."

> "As a solo founder your burn rate is your runway. I care about every $20. So when your tool said I could save $35/month by switching one plan, that's two extra months of runway over a year. That's not nothing."

> "What I really want is API cost tracking — like, per-feature or per-user. I have no idea if my contract analysis endpoint is profitable at the price I'm charging per document. That's a deeper problem than what you solve, but it's related."

> "I would send this to every founder in my network. Especially the ones building AI products — we're all guessing at our API costs."

### Surprising Moment
Meirambek pointed out a gap we hadn't considered: **solo AI product founders** have a fundamentally different cost structure than startup teams. Their AI spend isn't about seat-based subscriptions (Cursor Enterprise, GitHub Copilot Team) — it's almost entirely **API token costs** that scale with usage. SpendLens's current audit engine handles fixed-price subscriptions well but gives generic advice for API users ("monitor your spend"). For founders like Meirambek, the question isn't *which plan* but *which model and which prompting strategy* drives the biggest cost reduction. That's a completely different problem.

### What Changed in the Design
- Added a specific callout in the API tool result cards: *"API billing scales with usage. Use the [Anthropic cost calculator](https://www.anthropic.com/pricing) to estimate spend by feature — SpendLens can flag when you're on a more expensive model than your use case needs."*
- Recognized that solo AI founders are a distinct ICP segment worth a dedicated "API-first" audit mode in a future version
- Updated the `ECONOMICS.md` to note that solo founders have lower absolute spend but higher *sensitivity to savings* — even $30/mo matters to them



---

## Interview 2

**Interviewee:** Meghna S.
**Role:** Independent consultant / fractional CTO, works with 3–5 startups at a time
**Date:** May 24, 2025
**Format:** LinkedIn DM thread + 10-minute WhatsApp call

### Background
Meghna advises early-stage startups on their tech stack. She doesn't personally subscribe to many AI tools but helps her clients make tool decisions. She runs her own Notion AI and Claude Pro subscriptions.

### Key Quotes

> "Every founder I work with has subscribed to at least 2 AI coding tools and at least 2 AI chat tools. None of them have ever audited for overlap. It's just not on their radar."

> "The problem with most AI cost tools is they require you to connect your billing account. I'm never doing that for a free tool I just found on Reddit. The fact that this just asks me to type in what I'm paying is the right call."

> "What I'd really want is a 'team audit' version — where each engineer fills in their own tools and it aggregates up. Right now I'd have to do each person's tools manually."

> "The AI summary is nice but I want sources. Like, 'we recommend downgrading Cursor to Business because the Enterprise plan is for 20+ seat teams' — with a link to the Cursor pricing page."

### Surprising Moment
Meghna pointed out that the tool currently only supports a fixed tool list. She had a client using **Perplexity Pro** ($20/mo) and **Poe** ($20/mo) and asked if those were covered. They weren't. This revealed a gap: our initial tool list skews heavily toward coding tools and misses the AI research/productivity category.

### What Changed in the Design
- Added "Sources" links to the reasoning in `PRICING_DATA.md` (each recommendation now cites the official pricing page)
- Logged "team audit" (multi-user aggregation) as a future feature in ARCHITECTURE.md
- Flagged Perplexity Pro, Poe, and Notion AI as tools to add in the next sprint

---

## Interview 3

**Interviewee:** Karthik V.
**Role:** Software Engineer (senior IC), 30-person Series A startup
**Date:** May 25, 2025
**Format:** In-person (college senior, same campus), ~25 minutes

### Background
Not a founder — a senior engineer who manages his own tool subscriptions and occasionally influences team tool decisions. Uses Cursor Pro, Claude Pro, and occasional ChatGPT. His company pays for GitHub Copilot centrally.

### Key Quotes

> "I genuinely didn't know my company was already paying for Copilot until I looked at your audit results and thought 'wait, I should check.' Turned out I've been paying $10/mo for Copilot personally for 6 months while the company has an enterprise licence."

> "The savings number at the top is great. But I immediately wanted to scroll down to see which tool to cancel first. The ordering felt random — can you sort by highest savings at the top?"

> "I shared the link with two friends from college who are doing internships at startups. One of them came back saying 'this found $80/mo for my 3-person founding team.' That's not a huge number but it felt significant to them."

> "The 'No login required' thing is huge. I've abandoned so many tools at the signup form. The fact that I just typed in my tools and got a result in 30 seconds — that's why I actually completed it."

### Surprising Moment
Karthik ran the audit three times with different tool combinations to see how the recommendations changed. This was pure exploration/curiosity — he treated it more like a calculator than a one-time audit tool. This showed the potential for a "what if I switch from X to Y?" simulator mode.

### What Changed in the Design
- Results cards are now ordered by highest `monthlySavings` first within the results array — implemented in the audit engine sort logic
- The "No login required" social proof badge was made more prominent in the landing page hero section
- Logged "savings simulator / what-if tool" as a potential Phase 2 feature

---

## Cross-Interview Patterns

| Theme | Interview 1 — Meirambek (Solo AI Founder) | Interview 2 — Meghna (Fractional CTO) | Interview 3 — Karthik (Senior IC) |
|-------|-------------------------------------------|----------------------------------------|-----------------------------------|
| Never audited AI spend before | ✅ | ✅ (clients) | ✅ |
| Would share with team/co-founder | ✅ (founder network) | ✅ (clients) | ✅ (already did) |
| Privacy concern about connecting billing | ✅ (mentioned) | ✅ (key point) | ✅ (mentioned) |
| Wants more tool coverage | ✅ (API tier tracking) | ✅ (Perplexity, Poe) | ❌ |
| Wants sources/citations | ❌ | ✅ | ❌ |
| Would use again / recurring | ✅ (monthly runway check) | ✅ (for clients) | ✅ (already did 3x) |
| Unique insight | API-first founders are a distinct ICP | Team audit aggregation needed | Usage as a calculator, not one-off |

## Key Takeaways

1. **The problem is real and unaddressed** — All 3 interviewees had never formally audited AI spend before using SpendLens. It's not that they don't care — they just didn't have a fast, trustworthy way to do it.

2. **"No login" is a critical trust signal** — Two out of three explicitly named it as the reason they completed the audit instead of bouncing. This is a non-negotiable product constraint.

3. **The shareable link drives B2B virality** — Karthik shared it with 2 people *during* the interview. Meirambek said he'd send it to every AI founder he knows. The OG tags showing the savings number are what make it share-worthy, not just a link.

4. **Solo AI founders are a distinct, underserved segment** — Meirambek's interview revealed that API-first founders (building products on top of LLM APIs) have very different cost structures to subscription-based teams. Their pain is about *per-token costs and model selection*, not plan tiers. This unlocks a potential Phase 2 product direction.

5. **The tool list is a ceiling on utility** — Meghna's point about Perplexity Pro and Poe showed a gap in the AI research/productivity category. Expanding the tool list is the fastest way to make the tool relevant to more ICPs.

6. **Solo founders feel savings acutely** — Meirambek's framing that "$35/month = 2 extra months of runway over a year" was the most compelling reframe of the value proposition we heard. It suggests the landing page copy should speak to *runway* not just *savings*, especially for the solo founder segment.

