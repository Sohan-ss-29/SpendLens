# TESTS.md — Test Suite Documentation

## How to Run

```bash
# Run all tests once
npm test

# Run in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

All tests use **Vitest** (configured in `vitest.config.ts`). The test runner resolves `@/` path aliases matching the TypeScript config.

---

## Test Results (as of submission)

```
✓ src/__tests__/audit-engine.test.ts (37 tests) ~9ms

Test Files: 1 passed (1)
Tests:      37 passed (37)
Duration:   ~520ms
```

---

## Test File: `src/__tests__/audit-engine.test.ts`

**What it covers:** The entire `audit-engine.ts` — both the per-tool `auditTool()` function and the full `runAudit()` orchestrator with cross-tool redundancy detection.

### Result Shape Invariants (4 tests)

| Test | What it verifies |
|------|-----------------|
| `annualSavings = monthlySavings × 12` | Math consistency — annual is always exactly 12× monthly |
| `monthlySavings never negative` | Engine never tells users they'll pay *more* after recommendations |
| `recommendedAction always non-empty` | Every result has a human-readable action string |
| `projectedSpend ≤ currentSpend for downgrade` | Downgrade recommendations always result in lower spend |

### Cursor Rules (5 tests)

| Test | What it verifies |
|------|-----------------|
| Solo dev on Business → downgrade to Pro, saves $20 | Business plan overkill for single user |
| Team of 5 on Business → downgrade to Pro | Admin features not needed for small teams |
| Solo dev on Pro → optimal | Pro is the right plan for individual coders |
| Hobby (free) plan → optimal, zero spend | Free tier users should not be pushed to paid |
| 3-person team on Enterprise → downgrade to Business | Enterprise only justified for 20+ org orgs |

### GitHub Copilot Rules (3 tests)

| Test | What it verifies |
|------|-----------------|
| Solo dev on Business → downgrade to Individual, saves $9 | Business adds policy mgmt overkill for 1 dev |
| Team of 5 on Business → downgrade (saves $45) | Copilot Business vs 5× Individual comparison |
| Individual plan → optimal | Cheapest paid plan, correctly flagged as fine |

### Claude Rules (6 tests)

| Test | What it verifies |
|------|-----------------|
| Team plan with 2 seats → downgrade (Claude Team min is 5 seats) | Min seat enforcement catches underuse |
| Team plan with 5 seats → optimal | Exactly at minimum — correct plan |
| Max plan for solo non-coder → downgrade to Pro | Max's 5× rate limit only useful for coders |
| Max plan for solo coder → savings ≥ 0 | Max is valid for high-volume coding use cases |
| Pro plan → optimal | Standard individual paid plan |
| Free plan → optimal with zero spend | Free users never shown savings they don't have |

### ChatGPT Rules (4 tests)

| Test | What it verifies |
|------|-----------------|
| Team plan for 1 person → switch to Plus, saves $10 | Team workspace not needed for solo |
| Team plan for 2 people → switch to 2× Plus, saves $20 | 2× Plus cheaper than Team |
| Team plan for 5 people → optimal | Shared workspace justified at 5 |
| Plus plan (already cheapest paid) → optimal | No further savings possible |

### API / Usage-based Tools (4 tests)

| Test | What it verifies |
|------|-----------------|
| Anthropic API low spend ($50) → optimal, no Credex flag | Low API spend needs no action |
| Anthropic API high spend ($200+) → Credex opportunity flagged | High API spend is Credex's core opportunity |
| OpenAI API → usage-based, no seat logic | API tools skip the seat-based rules entirely |
| Claude API plan → treated as usage-based | `plan: 'api'` correctly routes to usage path |

### Windsurf Rules (4 tests)

| Test | What it verifies |
|------|-----------------|
| Solo dev on Teams → downgrade to Pro, saves $20 | Teams min 3 seats — solo overkill |
| 2 people on Teams → downgrade (saves $40) | Still under min 3 — should switch to 2× Pro |
| 3+ person team on Teams → optimal | At or above minimum, plan is correct |
| Free plan → optimal with zero spend | Free tier users not pushed to paid |

### Cross-tool Redundancy Detection (7 tests)

| Test | What it verifies |
|------|-----------------|
| Cursor Pro + Copilot (coding) → Copilot flagged as consolidate | Two AI coding IDEs overlap — flag the more expensive one |
| Cursor Hobby + Copilot (coding) → Copilot NOT flagged | Free Cursor doesn't trigger overlap detection |
| Cursor + Copilot (writing team) → no redundancy | Overlap rule only fires for coding use case |
| Cursor + Windsurf (both paid, coding) → Windsurf flagged | Two paid AI IDEs are redundant |
| `totalMonthlySavings` sums correctly | Aggregate savings math is correct |
| Already optimal setup → zero total savings | Tool correctly says "you're spending well" |
| 8-tool max-load test → all results valid | Full tool list runs without error or shape violations |

---

## Coverage Areas

| Area | Status |
|------|--------|
| `auditTool()` — all 8 tools | ✅ Covered |
| `runAudit()` — orchestration | ✅ Covered |
| Cross-tool redundancy (3 rules) | ✅ Covered |
| Edge cases (free plans, solo, max plans) | ✅ Covered |
| Result shape invariants | ✅ Covered |
| API routes (`/api/audit`, `/api/leads`, `/api/share`) | ❌ Not tested — Next.js API routes require integration test setup (e.g., Playwright or msw). Flagged as Week 2 work. |
| UI components | ❌ Not tested — component tests would use React Testing Library. Deferred. |

---

## CI Integration

Tests run automatically on every push to `main` via `.github/workflows/ci.yml`:

```yaml
- name: Run unit tests
  run: npm test
```

The CI step uses `npm test` which calls `vitest run --run` (single-pass, not watch mode). The workflow fails if any test fails, blocking the build step from running.
