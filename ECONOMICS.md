# ECONOMICS.md — Unit Economics & Path to $1M ARR

## What Is a Converted Lead Worth to Credex?

SpendLens is a **top-of-funnel lead generator** for Credex's core B2B product: AI tool credits and procurement discounts for startups.

### Credex Business Model (simplified)
Credex negotiates bulk discounts with AI vendors (Anthropic, OpenAI, Cursor, etc.) and passes a portion of savings to startups in exchange for routing their spend through Credex. Credex earns a **margin on the difference** between bulk pricing and standard pricing.

**Estimated LTV of a converted Credex lead:**

| Metric | Value | Source/Reasoning |
|--------|-------|-----------------|
| Avg monthly AI spend per startup | $400/mo | Based on SpendLens audit data (3 tools × $133 avg) |
| % Credex routes through their platform | 60% | Conservative estimate for partial adoption |
| Credex margin on routed spend | 8–12% | Standard SaaS reseller margin |
| Monthly revenue per converted customer | $19–$29/mo | 60% × $400 × 8–12% |
| Average customer lifetime | 18 months | Typical SaaS contract length |
| **LTV per converted customer** | **$342–$522** | $23/mo avg × 18 months |

---

## Customer Acquisition Cost (CAC) Per Channel

| Channel | Est. CAC | How |
|---------|----------|-----|
| Reddit / organic social | $0 | Founder time only |
| Indie Hackers | $0 | Free community posts |
| LinkedIn organic | $0 | Founder time |
| Product Hunt | $0 | Free launch |
| Word-of-mouth via share link | $0 | Viral loop built into product |
| LinkedIn ads (future) | $40–80 | Estimated based on B2B SaaS benchmarks |
| Google Ads "AI tool costs" (future) | $25–60 | Estimated CPC × CVR |

**At $0 CAC (organic) and $342–$522 LTV → Infinite payback ratio.** The tool pays for itself in cloud costs (est. $15/mo Supabase + $5/mo Vercel = $20/mo operational cost).

---

## Conversion Funnel Math

```
Stage                     | Number  | Conversion
--------------------------|---------|------------
Unique visitors           | 1,000   | —
Complete audit            | 600     | 60% (low friction: no login)
Submit email (lead gate)  | 180     | 30% of completers
Open share link (viral)   | 54      | 30% of email submitters share
Credex consult booked     | 18      | 10% of email submitters
Credex paid conversion    | 9       | 50% of consult bookings
```

**Revenue from 1,000 visitors:**
- 9 Credex paid customers × $23/mo avg = **$207/mo recurring**
- At 1,000 visitors/day → $207,000/mo recurring

---

## Path to $1M ARR

| Milestone | Visitors/day | Credex conversions | MRR | Timeline |
|-----------|-------------|-------------------|-----|----------|
| Month 1 | 50 | 1 | ~$280 | Launch |
| Month 3 | 200 | 4 | ~$1,100 | Post-PH |
| Month 6 | 800 | 15 | ~$4,200 | Growing |
| Month 12 | 2,500 | 47 | ~$13,000 | Scale |
| Month 18 | 7,500 | 140 | ~$39,000 | PMF proven |
| Month 24 | 25,000 | 470 | ~$131,000 | $1.5M ARR |

**$1M ARR requires:** ~360 active Credex customers at $230 avg annual value — achievable by Month 22–24.

---

## Discount Viability (Why Credex Can Afford to Give Users Savings)

Credex negotiates **volume-based pricing** with vendors. Example:

| Vendor | Standard price | Credex bulk price | Credex margin |
|--------|---------------|-------------------|--------------|
| Cursor Business | $40/seat/mo | $32/seat/mo | $8 (20%) |
| Anthropic Claude API | $0.003/token | $0.0024/token | $0.0006 (20%) |
| GitHub Copilot | $19/seat/mo | $15/seat/mo | $4 (21%) |

Even after passing 10–15% savings to the customer, Credex retains a 5–10% margin on total routed spend. At $400/mo average startup spend, this is **$20–$40/mo per customer** — profitable from customer #1.

---

## Key Risk Factors

1. **Vendor pushback on reseller programs** — Mitigated by building direct relationships and using affiliate models where bulk resale isn't allowed.
2. **Low AI spend among early-stage users** — SpendLens primarily targets 5–30 person teams. Below 5 people, AI spend is too low to generate meaningful Credex margin. Filter ICP accordingly.
3. **Audit accuracy** — Wrong recommendations destroy trust. Maintain `PRICING_DATA.md` with current public pricing. Refresh monthly.
