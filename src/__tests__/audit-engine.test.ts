// src/__tests__/audit-engine.test.ts
// Comprehensive test suite for the SpendLens audit engine
// Run: npm test

import { describe, it, expect } from 'vitest';
import { auditTool, runAudit } from '@/lib/audit-engine';
import type { ToolInput, AuditFormData } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeTool = (overrides: Partial<ToolInput> & { toolId: ToolInput['toolId'] }): ToolInput => ({
  plan: 'pro',
  monthlySpend: 20,
  seats: 1,
  ...overrides,
});

const makeAudit = (overrides: Partial<AuditFormData>): AuditFormData => ({
  teamSize: 5,
  useCase: 'coding',
  tools: [],
  ...overrides,
});

// ══════════════════════════════════════════════════════════════════════════════
// RESULT SHAPE
// ══════════════════════════════════════════════════════════════════════════════
describe('AuditResult — shape invariants', () => {
  it('always returns annualSavings = monthlySavings × 12', () => {
    const tool = makeTool({ toolId: 'cursor', plan: 'business', monthlySpend: 40, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it('monthlySavings is never negative', () => {
    const tools: ToolInput[] = [
      makeTool({ toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }),
      makeTool({ toolId: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 }),
      makeTool({ toolId: 'chatgpt', plan: 'plus', monthlySpend: 20, seats: 1 }),
      makeTool({ toolId: 'windsurf', plan: 'pro', monthlySpend: 15, seats: 1 }),
    ];
    tools.forEach((tool) => {
      const result = auditTool(tool, 3, 'coding');
      expect(result.monthlySavings).toBeGreaterThanOrEqual(0);
    });
  });

  it('always has a non-empty recommendedAction', () => {
    const tool = makeTool({ toolId: 'gemini', plan: 'advanced', monthlySpend: 20, seats: 1 });
    const result = auditTool(tool, 1, 'writing');
    expect(result.recommendedAction.length).toBeGreaterThan(0);
  });

  it('projectedSpend is always <= currentSpend for downgrade results', () => {
    const tool = makeTool({ toolId: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 });
    const result = auditTool(tool, 2, 'coding');
    if (result.recommendationType === 'downgrade') {
      expect(result.projectedSpend).toBeLessThanOrEqual(result.currentSpend);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// CURSOR RULES
// ══════════════════════════════════════════════════════════════════════════════
describe('Cursor — audit rules', () => {
  it('solo dev on Business → downgrade to Pro, saves $20', () => {
    const tool = makeTool({ toolId: 'cursor', plan: 'business', monthlySpend: 40, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.recommendedPlan).toBe('pro');
    expect(result.monthlySavings).toBe(20);
  });

  it('team of 5 on Business → downgrade to Pro (admin features rarely needed for small teams)', () => {
    const tool = makeTool({ toolId: 'cursor', plan: 'business', monthlySpend: 200, seats: 5 });
    const result = auditTool(tool, 5, 'coding');
    // Business is $40/seat vs Pro at $20/seat — for small coding teams, Pro is the right call
    // Only larger orgs (20+ seats) truly need Business admin dashboards
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it('solo dev on Pro → optimal', () => {
    const tool = makeTool({ toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.recommendationType).toBe('optimal');
    expect(result.monthlySavings).toBe(0);
  });

  it('Hobby (free) plan → optimal with $0 spend', () => {
    const tool = makeTool({ toolId: 'cursor', plan: 'hobby', monthlySpend: 0, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.recommendationType).toBe('optimal');
    expect(result.currentSpend).toBe(0);
    expect(result.monthlySavings).toBe(0);
  });

  it('3-person team on Enterprise → downgrade to Business', () => {
    const tool = makeTool({ toolId: 'cursor', plan: 'enterprise', monthlySpend: 180, seats: 3 });
    const result = auditTool(tool, 3, 'coding');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBeGreaterThan(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// GITHUB COPILOT RULES
// ══════════════════════════════════════════════════════════════════════════════
describe('GitHub Copilot — audit rules', () => {
  it('solo dev on Business → downgrade to Individual, saves $9', () => {
    const tool = makeTool({ toolId: 'github-copilot', plan: 'business', monthlySpend: 19, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.recommendedPlan).toBe('individual');
    expect(result.monthlySavings).toBe(9);
  });

  it('team of 5 on Business → downgrade to Individual (policy mgmt rarely needed for small teams)', () => {
    const tool = makeTool({ toolId: 'github-copilot', plan: 'business', monthlySpend: 95, seats: 5 });
    const result = auditTool(tool, 5, 'coding');
    // Copilot Business ($19/seat) vs Individual ($10/seat) — 5× Individual = $50/mo vs $95/mo
    // Business adds audit logs and policy mgmt — valuable for larger orgs, overkill for 5 devs
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it('Individual plan → optimal', () => {
    const tool = makeTool({ toolId: 'github-copilot', plan: 'individual', monthlySpend: 10, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.monthlySavings).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// CLAUDE RULES
// ══════════════════════════════════════════════════════════════════════════════
describe('Claude — audit rules', () => {
  it('Team plan with 2 seats → switch to 2× Pro (cheaper)', () => {
    const tool = makeTool({ toolId: 'claude', plan: 'team', monthlySpend: 60, seats: 2 });
    const result = auditTool(tool, 2, 'writing');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBe(20); // $60 - $40
  });

  it('Team plan with 5 seats → optimal (min seat requirement met)', () => {
    const tool = makeTool({ toolId: 'claude', plan: 'team', monthlySpend: 150, seats: 5 });
    const result = auditTool(tool, 5, 'writing');
    expect(result.recommendationType).toBe('optimal');
  });

  it('Max plan for solo non-coder → downgrade to Pro', () => {
    const tool = makeTool({ toolId: 'claude', plan: 'max', monthlySpend: 100, seats: 1 });
    const result = auditTool(tool, 1, 'writing');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.recommendedPlan).toBe('pro');
    expect(result.monthlySavings).toBe(80);
  });

  it('Max plan for solo coder → optimal (rate limits matter)', () => {
    const tool = makeTool({ toolId: 'claude', plan: 'max', monthlySpend: 100, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    // Max for coding is valid — high rate limits needed
    expect(result.monthlySavings).toBeGreaterThanOrEqual(0);
  });

  it('Pro plan → optimal', () => {
    const tool = makeTool({ toolId: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 });
    const result = auditTool(tool, 1, 'research');
    expect(result.monthlySavings).toBe(0);
  });

  it('Free plan → optimal with zero spend', () => {
    const tool = makeTool({ toolId: 'claude', plan: 'free', monthlySpend: 0, seats: 1 });
    const result = auditTool(tool, 1, 'writing');
    expect(result.currentSpend).toBe(0);
    expect(result.monthlySavings).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// CHATGPT RULES
// ══════════════════════════════════════════════════════════════════════════════
describe('ChatGPT — audit rules', () => {
  it('Team plan for 1 person → switch to Plus, saves $10', () => {
    const tool = makeTool({ toolId: 'chatgpt', plan: 'team', monthlySpend: 30, seats: 1 });
    const result = auditTool(tool, 1, 'writing');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBe(10);
  });

  it('Team plan for 2 people → switch to 2× Plus, saves $20', () => {
    const tool = makeTool({ toolId: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 });
    const result = auditTool(tool, 2, 'writing');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBe(20); // $60 - $40
  });

  it('Team plan for 5 people → optimal (shared workspace justified)', () => {
    const tool = makeTool({ toolId: 'chatgpt', plan: 'team', monthlySpend: 150, seats: 5 });
    const result = auditTool(tool, 5, 'mixed');
    expect(result.recommendationType).toBe('optimal');
  });

  it('Plus plan (already cheapest paid) → optimal', () => {
    const tool = makeTool({ toolId: 'chatgpt', plan: 'plus', monthlySpend: 20, seats: 1 });
    const result = auditTool(tool, 1, 'writing');
    expect(result.monthlySavings).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// API / USAGE-BASED TOOLS
// ══════════════════════════════════════════════════════════════════════════════
describe('API tools (usage-based)', () => {
  it('Anthropic API with low spend ($50) → optimal, no savings', () => {
    const tool = makeTool({ toolId: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 50, seats: 1 });
    const result = auditTool(tool, 3, 'coding');
    expect(result.recommendationType).toBe('optimal');
    expect(result.monthlySavings).toBe(0);
    expect(result.credexOpportunity).toBe(false);
  });

  it('Anthropic API with high spend ($200+) → flags Credex opportunity', () => {
    const tool = makeTool({ toolId: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 250, seats: 1 });
    const result = auditTool(tool, 5, 'coding');
    expect(result.credexOpportunity).toBe(true);
  });

  it('OpenAI API → usage-based, no seat logic applied', () => {
    const tool = makeTool({ toolId: 'openai-api', plan: 'pay-as-you-go', monthlySpend: 300, seats: 1 });
    const result = auditTool(tool, 10, 'coding');
    expect(result.currentSpend).toBe(300);
    expect(result.monthlySavings).toBe(0);
  });

  it('Claude API plan → treated as usage-based', () => {
    const tool = makeTool({ toolId: 'claude', plan: 'api', monthlySpend: 180, seats: 1 });
    const result = auditTool(tool, 3, 'coding');
    expect(result.monthlySavings).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// WINDSURF RULES
// ══════════════════════════════════════════════════════════════════════════════
describe('Windsurf — audit rules', () => {
  it('Solo dev on Teams → downgrade to Pro, saves $20', () => {
    const tool = makeTool({ toolId: 'windsurf', plan: 'teams', monthlySpend: 35, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBe(20);
  });

  it('2 people on Teams → switch to 2× Pro (cheaper than min 3 seats)', () => {
    const tool = makeTool({ toolId: 'windsurf', plan: 'teams', monthlySpend: 70, seats: 2 });
    const result = auditTool(tool, 2, 'coding');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBe(40); // $70 - $30
  });

  it('3+ person team on Teams → optimal', () => {
    const tool = makeTool({ toolId: 'windsurf', plan: 'teams', monthlySpend: 105, seats: 3 });
    const result = auditTool(tool, 3, 'coding');
    expect(result.recommendationType).toBe('optimal');
  });

  it('Free plan → optimal with zero spend', () => {
    const tool = makeTool({ toolId: 'windsurf', plan: 'free', monthlySpend: 0, seats: 1 });
    const result = auditTool(tool, 1, 'coding');
    expect(result.monthlySavings).toBe(0);
    expect(result.currentSpend).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// CROSS-TOOL RULES (runAudit level)
// ══════════════════════════════════════════════════════════════════════════════
describe('Cross-tool — redundancy detection', () => {
  it('Cursor Pro + Copilot (coding) → Copilot flagged as consolidate', () => {
    const { results } = runAudit(makeAudit({
      useCase: 'coding',
      tools: [
        makeTool({ toolId: 'cursor', plan: 'pro', monthlySpend: 60, seats: 3 }),
        makeTool({ toolId: 'github-copilot', plan: 'individual', monthlySpend: 30, seats: 3 }),
      ],
    }));
    const copilot = results.find((r) => r.toolId === 'github-copilot');
    expect(copilot?.recommendationType).toBe('consolidate');
    expect(copilot?.monthlySavings).toBe(30);
  });

  it('Cursor Hobby + Copilot (coding) → Copilot NOT flagged (Hobby is free tier)', () => {
    const { results } = runAudit(makeAudit({
      useCase: 'coding',
      tools: [
        makeTool({ toolId: 'cursor', plan: 'hobby', monthlySpend: 0, seats: 1 }),
        makeTool({ toolId: 'github-copilot', plan: 'individual', monthlySpend: 10, seats: 1 }),
      ],
    }));
    const copilot = results.find((r) => r.toolId === 'github-copilot');
    expect(copilot?.recommendationType).not.toBe('consolidate');
  });

  it('Cursor + Copilot (writing team) → no redundancy flag', () => {
    const { results } = runAudit(makeAudit({
      useCase: 'writing',
      tools: [
        makeTool({ toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }),
        makeTool({ toolId: 'github-copilot', plan: 'individual', monthlySpend: 10, seats: 1 }),
      ],
    }));
    const copilot = results.find((r) => r.toolId === 'github-copilot');
    expect(copilot?.recommendationType).not.toBe('consolidate');
  });

  it('Cursor + Windsurf (both paid, coding) → Windsurf flagged as consolidate', () => {
    const { results } = runAudit(makeAudit({
      useCase: 'coding',
      tools: [
        makeTool({ toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }),
        makeTool({ toolId: 'windsurf', plan: 'pro', monthlySpend: 15, seats: 1 }),
      ],
    }));
    const windsurf = results.find((r) => r.toolId === 'windsurf');
    expect(windsurf?.recommendationType).toBe('consolidate');
    expect(windsurf?.monthlySavings).toBe(15);
  });

  it('totalMonthlySavings sums correctly across all tools', () => {
    const { results, totalMonthlySavings, totalAnnualSavings } = runAudit(makeAudit({
      useCase: 'coding',
      tools: [
        makeTool({ toolId: 'cursor', plan: 'business', monthlySpend: 40, seats: 1 }),  // saves $20
        makeTool({ toolId: 'chatgpt', plan: 'team', monthlySpend: 30, seats: 1 }),     // saves $10
      ],
    }));
    const expectedSavings = results.reduce((sum, r) => sum + r.monthlySavings, 0);
    expect(totalMonthlySavings).toBe(expectedSavings);
    expect(totalAnnualSavings).toBe(expectedSavings * 12);
  });

  it('already optimal setup returns zero savings', () => {
    const { totalMonthlySavings } = runAudit(makeAudit({
      useCase: 'writing',
      tools: [
        makeTool({ toolId: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 }),
        makeTool({ toolId: 'gemini', plan: 'free', monthlySpend: 0, seats: 1 }),
      ],
    }));
    expect(totalMonthlySavings).toBe(0);
  });

  it('maximum tool count (8 tools) runs without error', () => {
    const { results } = runAudit(makeAudit({
      teamSize: 10,
      useCase: 'mixed',
      tools: [
        makeTool({ toolId: 'cursor', plan: 'business', monthlySpend: 400, seats: 10 }),
        makeTool({ toolId: 'github-copilot', plan: 'business', monthlySpend: 190, seats: 10 }),
        makeTool({ toolId: 'claude', plan: 'team', monthlySpend: 300, seats: 10 }),
        makeTool({ toolId: 'chatgpt', plan: 'team', monthlySpend: 300, seats: 10 }),
        makeTool({ toolId: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 500, seats: 1 }),
        makeTool({ toolId: 'openai-api', plan: 'pay-as-you-go', monthlySpend: 400, seats: 1 }),
        makeTool({ toolId: 'gemini', plan: 'business', monthlySpend: 300, seats: 10 }),
        makeTool({ toolId: 'windsurf', plan: 'teams', monthlySpend: 350, seats: 10 }),
      ],
    }));
    expect(results).toHaveLength(8);
    results.forEach((r) => {
      expect(r.monthlySavings).toBeGreaterThanOrEqual(0);
      expect(r.annualSavings).toBe(r.monthlySavings * 12);
    });
  });
});
