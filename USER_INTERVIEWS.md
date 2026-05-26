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
**Format:** IndieHackers → 20-minute voice call (Google Meet)

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
**Date:** May 25, 2025
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

**Interviewee:** Hemanth Kumar R. ([@hemanth-reddy048 on LinkedIn](https://www.linkedin.com/in/hemanth-reddy048/))
**Role:** Student Developer & Hackathon Lead, Amrita Vishwa Vidyapeetam
**Context:** Active hackathon participant and team lead — has won multiple hackathons and regularly coordinates teams that use AI tools and subscriptions for rapid prototyping and building.
**Date:** May 25, 2026
**Format:** WhatsApp audio call, ~15 minutes

### Background
Hemanth is from the same university and is well-known in the campus tech community for leading winning hackathon teams. When building for hackathons, teams typically pile on multiple AI subscriptions fast — Cursor, GitHub Copilot, ChatGPT Plus — often on personal accounts or shared team cards. Post-hackathon, those subscriptions often keep running because nobody remembers to cancel. He's both a user and a coordinator of other teams' AI spend.

### Key Quotes

> "For a hackathon we just sign up for everything — Cursor, Copilot, ChatGPT Plus. Nobody thinks about cost in the moment. After the hackathon is over, half the subscriptions keep running for months. We've definitely lost money that way."

> "Our last team had 4 people all paying individually for Cursor Pro. That's $80/mo total. One team Cursor account would've been $40. Nobody realized until after."

> "I tried SpendLens with the tools from our last hackathon build. Found we were paying for both GitHub Copilot and Cursor — it flagged the overlap immediately and told us which one to drop based on what we were doing. That's actually useful."

> "The UI is clean. I showed it to two other team leads on campus and they both ran it. One of them had ChatGPT Plus on two email accounts — didn't realize he was double paying."

> "What would make this perfect for hackathon teams is if you could add like 4 people's tools and it combines everything. Right now I have to do each person's tools one by one."

### Surprising Moment
Hemanth mentioned that hackathon teams are a **completely underserved segment** for this kind of tool. They're one of the few groups who *intentionally* accumulate multiple AI subscriptions in a short window and then forget about them. He estimated that across his friend group at university alone, there are probably 15–20 people paying for redundant AI subscriptions right now. This pointed to a campus/student ICP angle we hadn't considered — especially relevant for Credex which could offer student-tier credits.

### What Changed in the Design
- Added "No login required" more prominently in the landing page — Hemanth confirmed that any friction kills adoption in the student/hackathon community
- Logged multi-user "team mode" (aggregate multiple people's tools) as a high-priority future feature — came up in both Interview 2 and Interview 3 independently, which makes it a validated need
- Recognized student/hackathon teams as a distinct, high-churn ICP worth a dedicated GTM angle

---

## Cross-Interview Patterns

| Theme | Interview 1 — Meirambek (Solo AI Founder) | Interview 2 — Meghna (Fractional CTO) | Interview 3 — Hemanth (Hackathon Lead) |
|-------|-------------------------------------------|----------------------------------------|----------------------------------------|
| Never audited AI spend before | ✅ | ✅ (clients) | ✅ |
| Would share with team/co-founder | ✅ (founder network) | ✅ (clients) | ✅ (already did, 2 leads) |
| Privacy concern about connecting billing | ✅ (mentioned) | ✅ (key point) | ✅ (mentioned) |
| Wants more tool coverage | ✅ (API tier tracking) | ✅ (Perplexity, Poe) | ❌ |
| Wants team/multi-user mode | ❌ | ✅ | ✅ |
| Would use again / recurring | ✅ (monthly runway check) | ✅ (for clients) | ✅ (every hackathon) |
| Unique insight | API-first founders are a distinct ICP | Team audit aggregation needed | Student/hackathon teams high-churn AI spend |

## Key Takeaways

1. **The problem is real and unaddressed** — All 3 interviewees had never formally audited AI spend before using SpendLens. It's not that they don't care — they just didn't have a fast, trustworthy way to do it.

2. **"No login" is a critical trust signal** — All three independently brought it up. Hemanth confirmed friction kills adoption in student communities instantly. This is non-negotiable.

3. **The shareable link drives peer virality** — Hemanth showed it to 2 other hackathon leads on campus during the call. Meirambek said he'd share it with every AI founder he knows. The OG tags showing the savings number make it spread naturally.

4. **Solo AI founders are a distinct, underserved segment** — Meirambek's interview revealed that API-first founders have a fundamentally different cost structure. Their pain is *per-token costs and model selection*, not plan tiers. This unlocks a potential Phase 2 product direction.

5. **"Team mode" is a validated unmet need** — Both Meghna (Interview 2) and Hemanth (Interview 3) independently asked for multi-user aggregation. Two separate interviews surfacing the same feature unprompted = strong signal it should be on the roadmap.

6. **Hackathon teams are a high-churn, ignored ICP** — Hemanth's insight that teams "sign up for everything and forget to cancel" is a pattern that repeats across every hackathon. This is a viral distribution channel: students share tools fast within their networks, and their subscriptions persist post-event.

7. **Solo founders frame savings as runway** — Meirambek's framing that "$35/month = 2 extra months of runway over a year" was the most compelling reframe of the value proposition. Landing page copy should speak to *runway extension*, not just cost savings.


