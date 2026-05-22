# PROMPTS.md — AI Summary Prompting Log

> Documents the prompt engineering process for the Claude-powered audit summary feature.
> Full implementation happens on Day 4 — this is the Day 1 planning document.

---

## Goal

Generate a ~100-word, personalized summary paragraph that:
1. Acknowledges the team's current situation (size, use case)
2. Highlights the biggest savings opportunity
3. Gives a sense of urgency without being salesy
4. Mentions Credex credits as an option when savings > $500/mo

---

## Final Prompt (Day 4)

*To be written on Day 4 after iterating.*

---

## Prompt Iterations

### Attempt 1 (Draft — Day 1)

```
System: You are a financial advisor specializing in SaaS cost optimization for startups.

User: Here is an AI tool audit for a team:
- Team size: {teamSize}
- Primary use case: {useCase}
- Tools audited: {toolsList}
- Total monthly savings identified: ${totalSavings}
- Top recommendation: {topRecommendation}

Write a 2-3 sentence summary of their situation and what they should do. Be direct and specific. Mention the dollar amount. Do not use bullet points.
```

**Result:** Too generic, didn't vary much between audits.

**Problem:** The model wasn't given enough context about *why* the savings exist, just the number.

---

### Attempt 2 (Planned)

Add per-tool reasoning to the prompt so Claude can write a more specific summary. Also add use-case-specific framing (e.g., "for a coding-focused team, Cursor is worth it but Copilot is redundant").

---

### Attempt 3 (Planned)

Try system prompt: "You are helping a startup CTO understand their AI tool costs. Be direct, friendly, and specific. Never use jargon like 'leverage' or 'synergy'."

---

## Fallback Template

When the API fails, this template is used (see `src/lib/ai-summary.ts`):

```
Your team of {teamSize} could save ${monthlySavings}/month (${annualSavings}/year) on AI tools. 
The biggest opportunity is {topTool}: {topRecommendation}. 
For {useCase}-focused teams, the recommendations above prioritize tools with the best 
performance-to-cost ratio. Acting on these today locks in savings before vendor prices increase.
```

**When fallback triggers:** Anthropic API error, timeout >5s, rate limit hit.

---

## Token Budget

| Component | ~Tokens |
|-----------|---------|
| System prompt | ~80 |
| Tool data (7 tools) | ~300 |
| Audit results | ~200 |
| Total input | ~580 |
| Output (100 words) | ~130 |
| **Cost per audit** | **~$0.0002** |

At 10,000 audits/month: ~$2.00 total. Negligible.

---

## What I Tried That Didn't Work

*To be filled in on Day 4 after actual experimentation.*
