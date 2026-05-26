# USER_INTERVIEWS.md — User Research

## Overview

**Goal:** Validate whether founders and engineering managers feel the problem of AI tool overspend, whether SpendLens's approach resonates, and what's missing.

**Method:** 15–20 minute video/voice calls over Google Meet/WhatsApp, or detailed async DMs/email threads. Structured around 5 core questions but allowed to go wherever the conversation led.

**Recruited via:** College network (Amrita Vishwa Vidyapeetam CS batch), LinkedIn connections, Indie Hackers community.

---

## Interview 1

**Interviewee:** Aditya R.
**Role:** Co-founder & CTO, early-stage EdTech SaaS (6 people)
**Date:** May 23, 2025
**Format:** WhatsApp voice call, ~20 minutes

### Background
Running a 6-person team building an EdTech platform. Uses Cursor for all 4 engineers, had recently added ChatGPT Team for product/design, and was experimenting with Claude API for their AI tutoring feature.

### Key Quotes

> "I have no idea what our actual AI bill is. I know it's somewhere between $400 and $700 a month but I've never sat down to add it up. It's embarrassing — I track every other SaaS line by line."

> "The moment you showed me the overlap between Cursor and GitHub Copilot, I was like — wait, two of our engineers have both? I approved both onboarding requests separately without realising."

> "I would 100% share this with my co-founder. She handles the finances and she'll love seeing a specific number instead of me saying 'I think we might be overspending on AI stuff.'"

### Surprising Moment
When shown the results page with the AI summary, Aditya immediately asked: "Can I get this as a PDF?" He wanted to share it in their quarterly ops review, not just as a link. This was unexpected — the use case of *internal reporting* rather than just *individual awareness* hadn't been on our radar.

### What Changed in the Design
- Added the shareable link with OG tags to make sharing easy
- The "Company Team Size" field in the lead capture form was added based on this call — he mentioned the savings recommendations differed significantly between 4 vs 20 seats
- Considered adding a PDF export (deferred to post-launch)

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

| Theme | Interview 1 | Interview 2 | Interview 3 |
|-------|-------------|-------------|-------------|
| Never audited AI spend before | ✅ | ✅ (clients) | ✅ |
| Would share with team/co-founder | ✅ | ✅ (clients) | ✅ (already did) |
| Privacy concern about connecting billing | N/A | ✅ (key point) | ✅ (mentioned) |
| Wants more tool coverage | ❌ | ✅ (Perplexity, Poe) | ❌ |
| Wants sources/citations | ❌ | ✅ | ❌ |
| Would use again / recurring | ✅ (monthly) | ✅ (for clients) | ✅ (already did 3x) |

## Key Takeaways

1. **The problem is real and unaddressed** — All 3 interviewees had never formally audited AI spend. It's not that they don't care, it's that they don't have a fast way to do it.

2. **"No login" is a critical trust signal** — Two out of three explicitly mentioned it as a reason they completed the audit. This is non-negotiable product design.

3. **The shareable link drives B2B virality** — The share URL wasn't just a nice-to-have; Karthik already shared it with 2 people before the interview ended. The OG tags (showing savings number) make it share-worthy.

4. **The tool list is a ceiling on utility** — Meghna's point about Perplexity and Poe revealed a real gap. The tool list needs to expand to cover the full spectrum: AI writing (Jasper, Copy.ai), AI research (Perplexity, Elicit), and productivity (Notion AI, Otter.ai).

5. **ICs are a backdoor into company budgets** — Karthik is not a buyer, but his audit led him to discover a $120/yr personal expense (duplicate Copilot) and made him share the tool. IC adoption → manager awareness → company-level conversation.
