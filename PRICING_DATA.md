# PRICING_DATA.md — AI Tool Pricing Reference

> All pricing data cited with vendor source URLs and pull dates.
> This file is updated whenever pricing changes.
> Last verified: May 22, 2026

---

## Important Notes

- All prices in **USD per seat per month** unless noted
- "Seat" = one user license
- Enterprise prices are estimated from public case studies / press releases unless a source URL is available
- API/usage-based prices are excluded from seat calculations (tracked as monthly spend input)

---

## Cursor

**Source:** https://www.cursor.com/pricing  
**Verified:** May 22, 2026

| Plan | Price/seat/month | Notes |
|------|-----------------|-------|
| Hobby | $0 | 2,000 completions/mo, limited pro usage |
| Pro | $20 | Unlimited completions, 500 fast premium requests/mo |
| Business | $40 | Everything in Pro + admin dashboard, enforced privacy mode |
| Enterprise | ~$60+ | Contact sales; includes SSO, custom contracts |

**Key audit rule:** Solo developers on Business when Pro suffices → save $20/seat/mo.

---

## GitHub Copilot

**Source:** https://github.com/features/copilot#pricing  
**Verified:** May 22, 2026

| Plan | Price/seat/month | Notes |
|------|-----------------|-------|
| Individual | $10 | ~$19 billed annually ($10/mo) |
| Business | $19 | Admin controls, policy management, audit logs |
| Enterprise | $39 | Enterprise SSO, security features, Copilot Chat in IDE |

**Key audit rule:** Teams <10 paying Enterprise when Business suffices → $20/seat/mo savings. Individuals paying Individual when free GitHub Copilot (students/OSS maintainers) applies → $10/seat/mo savings.

---

## Claude (Anthropic)

**Source:** https://www.anthropic.com/pricing  
**Verified:** May 22, 2026

| Plan | Price/seat/month | Notes |
|------|-----------------|-------|
| Free | $0 | Limited messages, Claude 3 Haiku only |
| Pro | $20 | 5x more usage, Claude 3.5 Sonnet, Projects |
| Max | $100 | Maximum usage limits, priority access |
| Team | $30/seat | Min 5 seats, shared Projects, admin console |
| Enterprise | ~$60/seat | SSO, custom data retention, priority support |
| API | Usage-based | See api.anthropic.com/pricing |

**Key audit rule:** Teams of 2–4 on Team plan ($30/seat, min 5 seats = $150 min) when 2×Pro ($40) is cheaper. Teams on Max ($100) when Pro ($20) usage limits are sufficient.

---

## ChatGPT (OpenAI)

**Source:** https://openai.com/chatgpt/pricing  
**Verified:** May 22, 2026

| Plan | Price/seat/month | Notes |
|------|-----------------|-------|
| Free | $0 | Limited GPT-4o access |
| Plus | $20 | GPT-4o, DALL-E 3, Advanced Data Analysis |
| Team | $30/seat | Min 2 seats, shared workspace, admin controls |
| Enterprise | ~$60/seat | Estimated; custom pricing |
| API | Usage-based | platform.openai.com/pricing |

**Key audit rule:** 2 people on Team ($60/mo) vs 2×Plus ($40/mo) — $20/mo savings if admin features aren't needed.

---

## Anthropic API (Direct)

**Source:** https://www.anthropic.com/api  
**Verified:** May 22, 2026

| Model | Input (per MTok) | Output (per MTok) |
|-------|-----------------|-------------------|
| Claude 3 Haiku | $0.25 | $1.25 |
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Claude 3.5 Opus | $15.00 | $75.00 |

**Key audit rule:** Teams paying for Claude Pro + Anthropic API → may be better served by API-only if they're building. Teams only using chat → API is likely overkill.

---

## OpenAI API (Direct)

**Source:** https://openai.com/api/pricing  
**Verified:** May 22, 2026

| Model | Input (per MTok) | Output (per MTok) |
|-------|-----------------|-------------------|
| GPT-4o mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |
| GPT-4 Turbo | $10.00 | $30.00 |
| o1 | $15.00 | $60.00 |

---

## Google Gemini

**Source:** https://one.google.com/about/ai-premium and https://workspace.google.com/pricing  
**Verified:** May 22, 2026

| Plan | Price/seat/month | Notes |
|------|-----------------|-------|
| Free | $0 | Gemini 1.5 Flash |
| Advanced | $20 | Google One AI Premium; Gemini 1.5 Pro |
| Business | $30/seat | Google Workspace Business + Gemini; min 1 seat |
| API | Usage-based | ai.google.dev/pricing |

**Key audit rule:** Individuals on Advanced when the free tier usage is sufficient. Teams paying per-seat Business pricing when API access would be cheaper for their use case.

---

## Windsurf (Codeium)

**Source:** https://windsurf.com/pricing  
**Verified:** May 22, 2026

| Plan | Price/seat/month | Notes |
|------|-----------------|-------|
| Free | $0 | Basic autocomplete, 5 Flows/day |
| Pro | $15 | Unlimited Flows, priority models |
| Teams | $35/seat | Min 3 seats, admin, SSO |
| Enterprise | ~$50/seat | Estimated; on-prem options |

**Key audit rule:** Solo devs paying Teams when Pro suffices → $20/seat savings. Teams on both Cursor and Windsurf → consolidate to one AI IDE tool.

---

## Cross-Tool Opportunities

| Scenario | Current Spend | Recommended | Savings |
|----------|--------------|-------------|---------|
| Claude Pro + ChatGPT Plus (both) | $40/mo | Pick one based on use case | $20/mo |
| Cursor Business + GitHub Copilot Business | $59/mo | Cursor Business only (includes LLM) | $19/mo |
| Anthropic API + Claude Pro (overlap) | $20+usage | API only if building; Pro if just chatting | Varies |
| Windsurf Teams (3 seats) + Cursor Pro (3 seats) | $165/mo | One AI IDE, pick best fit | $45-60/mo |
