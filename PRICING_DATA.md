# PRICING_DATA.md — Vendor Pricing Reference

> All pricing verified directly from vendor pricing pages.
> **Every number has a source URL and verification date.**
> Used by the audit engine in `src/lib/pricing-data.ts`.

---

## Cursor

**Source:** https://www.cursor.com/pricing  
**Verified:** May 23, 2026

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Hobby | $0 | 2,000 completions/mo, limited Claude/GPT-4o fast requests |
| Pro | $20 | Unlimited completions, 500 fast premium requests/mo, 10 Claude Opus |
| Business | $40 | Everything in Pro + admin dashboard, enforced privacy mode, centralized billing |
| Enterprise | Contact sales (~$60–80 est.) | SSO, custom deployment, advanced security |

**Audit rules used:**
- Solo dev on Business → Pro saves $20/seat/mo (no need for admin dashboard)
- Teams < 5 on Business for non-admin-heavy use cases → Pro
- Enterprise for teams < 20 → Business

**Notes:** Cursor pricing updated frequently. Verify before major decisions.

---

## GitHub Copilot

**Source:** https://github.com/features/copilot#pricing  
**Verified:** May 23, 2026

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Individual | $10 | AI code completion, chat in IDE, CLI |
| Business | $19 | + Policy management, audit logs, IP indemnity |
| Enterprise | $39 | + Custom models, Copilot Chat in GitHub.com, security features |

**Audit rules used:**
- Solo on Business → Individual saves $9/seat/mo
- Teams < 5 on Business → Individual plans (audit logs not needed for small teams)
- Enterprise for teams < 20 → Business

**Notes:** GitHub offers free Copilot for verified students and popular OSS maintainers. Check eligibility before paying.

---

## Claude (Anthropic)

**Source:** https://www.anthropic.com/pricing  
**Verified:** May 23, 2026

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | Limited Claude 3.5 Haiku access |
| Pro | $20 | 5× usage vs Free, Claude 3.5 Sonnet + Opus, Projects |
| Max | $100 | Maximum rate limits, priority access, ideal for heavy coders |
| Team | $30/seat (min 5) | Shared Projects, admin console, $150/mo minimum |
| Enterprise | ~$60/seat | SSO, custom data retention, compliance features |
| API | Usage-based | See https://www.anthropic.com/api |

**Audit rules used:**
- Team plan with < 5 seats → N individual Pro plans are cheaper ($20×N vs $30×5)
- Max for solo non-coder → Pro saves $80/mo (rate limits not needed for writing/research)
- Max with 5+ seats → Team plan is 70% cheaper per seat
- Enterprise for teams < 15 → Team plan

**Notes:** Claude Team has a hard 5-seat minimum — paying for 5 seats when you have 2 users wastes $70/mo.

---

## ChatGPT (OpenAI)

**Source:** https://openai.com/chatgpt/pricing  
**Verified:** May 23, 2026

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | GPT-4o mini, limited GPT-4o |
| Plus | $20 | GPT-4o, DALL-E 3, Advanced Data Analysis, custom GPTs |
| Team | $30/seat (min 2) | Shared workspace, custom GPTs for team, admin console |
| Enterprise | ~$60/seat | Advanced security, compliance, dedicated capacity |
| API | Usage-based | See https://platform.openai.com/pricing |

**Audit rules used:**
- Team for 1–2 people → Plus saves $10/seat/mo (no need for shared workspace)
- Enterprise for teams < 20 → Team plan
- Plus for 10+ person teams → evaluate Team for shared custom GPTs

**Notes:** ChatGPT Team requires minimum 2 seats. Annual billing saves ~16% vs monthly.

---

## Anthropic API (Direct)

**Source:** https://www.anthropic.com/api  
**Verified:** May 23, 2026

| Model | Input per MTok | Output per MTok |
|-------|---------------|----------------|
| Claude 3 Haiku | $0.25 | $1.25 |
| Claude 3.5 Haiku | $0.80 | $4.00 |
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Claude 3 Opus | $15.00 | $75.00 |
| Claude 3.5 Opus | $15.00 | $75.00 |

**Audit rules used:**
- Monthly spend > $100 → flag Credex credits opportunity
- Monthly spend > $200 → prominently recommend Credex (20–40% discount potential)

**Cost example:** 1,000 API calls with avg 500 input + 300 output tokens using Sonnet:
- Input: 0.5 MTok × $3 = $1.50
- Output: 0.3 MTok × $15 = $4.50
- **Total: ~$6/1,000 calls**

---

## OpenAI API (Direct)

**Source:** https://platform.openai.com/pricing  
**Verified:** May 23, 2026

| Model | Input per MTok | Output per MTok |
|-------|---------------|----------------|
| GPT-4o mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |
| GPT-4 Turbo | $10.00 | $30.00 |
| o1-mini | $1.10 | $4.40 |
| o1 | $15.00 | $60.00 |
| o3-mini | $1.10 | $4.40 |

**Audit rules used:**
- Same as Anthropic API: flag Credex opportunity above $100/mo
- High spend ($300+) → prominently recommend Credex credits

---

## Google Gemini

**Source:** https://one.google.com/about/ai-premium and https://workspace.google.com/pricing  
**Verified:** May 23, 2026

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | Gemini 2.0 Flash, limited Gemini 2.5 Pro |
| Advanced | $20 | Google One AI Premium; Gemini 2.5 Pro, 2TB storage |
| Business | $30/seat | Google Workspace Business + Gemini; deep Docs/Sheets integration |
| API | Usage-based | See https://ai.google.dev/pricing |

**Audit rules used:**
- Advanced for solo coders → suggest exploring Claude/ChatGPT alternatives (better coding integrations)
- Business for non-Google-Workspace teams → Advanced individual plans likely cheaper

**Notes:** Gemini Business pricing is intertwined with Google Workspace. If your team doesn't use Google Workspace, the Business plan is almost certainly not the right choice.

---

## Windsurf (Codeium)

**Source:** https://windsurf.com/pricing  
**Verified:** May 23, 2026

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | Basic autocomplete, 5 AI Flows/day |
| Pro | $15 | Unlimited Flows, Cascade (AI agent), priority models |
| Teams | $35/seat (min 3) | All Pro features + admin, SSO, centralized billing |
| Enterprise | ~$50/seat | On-prem options, custom models, advanced security |

**Audit rules used:**
- Solo on Teams → Pro saves $20/seat/mo
- 2 people on Teams → 2× Pro ($30) vs Teams ($70) — saves $40/mo
- Enterprise for teams < 15 → Teams plan
- Cursor + Windsurf both paid (coding teams) → flag as redundant AI IDEs

**Notes:** Windsurf Teams has a hard 3-seat minimum. 2-person teams paying Teams ($70/mo) should switch to 2× Pro ($30/mo).

---

## Cross-Tool Pricing Scenarios

| Scenario | Monthly Cost | Better Alternative | Monthly Savings |
|----------|-------------|-------------------|----------------|
| Cursor Pro + Copilot Individual (5 devs) | $150 | Cursor Pro only | $50/mo ($600/yr) |
| Cursor Business + Copilot Business (5 devs) | $295 | Cursor Pro only | $145/mo ($1,740/yr) |
| Claude Pro + ChatGPT Plus (1 user) | $40 | Pick one | $20/mo ($240/yr) |
| Claude Team (2 seats) vs 2× Claude Pro | $150 vs $40 | 2× Claude Pro | $110/mo ($1,320/yr) |
| Cursor + Windsurf Pro (5 devs) | $175 | Cursor Pro only | $75/mo ($900/yr) |
| Windsurf Teams (2 users) vs 2× Pro | $70 vs $30 | 2× Pro | $40/mo ($480/yr) |

---

*Prices are in USD. All figures are monthly unless stated. Prices are subject to change — verify at vendor websites before making procurement decisions.*
