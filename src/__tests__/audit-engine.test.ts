// src/__tests__/audit-engine.test.ts
// Unit tests for the audit engine
// Full test suite in Day 3 — stub here to ensure CI passes from Day 1

import { describe, it, expect } from 'vitest';
import { auditTool, runAudit } from '@/lib/audit-engine';
import type { ToolInput, AuditFormData } from '@/types';

describe('auditTool', () => {
  it('returns a valid AuditResult shape for a single tool', () => {
    const tool: ToolInput = {
      toolId: 'cursor',
      plan: 'pro',
      monthlySpend: 20,
      seats: 1,
    };

    const result = auditTool(tool, 1, 'coding');

    expect(result).toMatchObject({
      toolId: 'cursor',
      toolName: 'Cursor',
      currentPlan: 'pro',
      currentSpend: 20,
    });
    expect(result.monthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.annualSavings).toEqual(result.monthlySavings * 12);
  });
});

describe('runAudit', () => {
  it('sums savings across all tools', () => {
    const formData: AuditFormData = {
      teamSize: 5,
      useCase: 'coding',
      tools: [
        { toolId: 'cursor', plan: 'pro', monthlySpend: 100, seats: 5 },
        { toolId: 'github-copilot', plan: 'individual', monthlySpend: 50, seats: 5 },
      ],
    };

    const { results, totalMonthlySavings, totalAnnualSavings } = runAudit(formData);

    expect(results).toHaveLength(2);
    expect(totalAnnualSavings).toEqual(totalMonthlySavings * 12);
    expect(totalMonthlySavings).toBeGreaterThanOrEqual(0);
  });

  it('handles single-tool audit', () => {
    const formData: AuditFormData = {
      teamSize: 1,
      useCase: 'writing',
      tools: [
        { toolId: 'chatgpt', plan: 'plus', monthlySpend: 20, seats: 1 },
      ],
    };

    const { results } = runAudit(formData);
    expect(results).toHaveLength(1);
    expect(results[0].toolId).toBe('chatgpt');
  });
});
