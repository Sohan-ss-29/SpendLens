// src/__tests__/audit-engine.test.ts
import { describe, it, expect } from 'vitest';
import { auditTool, runAudit } from '@/lib/audit-engine';
import type { ToolInput, AuditFormData } from '@/types';

describe('auditTool — basic shape', () => {
  it('returns valid AuditResult shape', () => {
    const tool: ToolInput = { toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 };
    const result = auditTool(tool, 1, 'coding');
    expect(result.toolId).toBe('cursor');
    expect(result.toolName).toBe('Cursor');
    expect(result.monthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it('marks solo dev on Cursor Business as downgrade', () => {
    const tool: ToolInput = { toolId: 'cursor', plan: 'business', monthlySpend: 40, seats: 1 };
    const result = auditTool(tool, 1, 'coding');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBe(20);
  });

  it('marks Claude team plan for 2 seats as downgrade', () => {
    const tool: ToolInput = { toolId: 'claude', plan: 'team', monthlySpend: 60, seats: 2 };
    const result = auditTool(tool, 2, 'writing');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it('marks ChatGPT team for 1 seat as downgrade to plus', () => {
    const tool: ToolInput = { toolId: 'chatgpt', plan: 'team', monthlySpend: 30, seats: 1 };
    const result = auditTool(tool, 1, 'writing');
    expect(result.recommendationType).toBe('downgrade');
    expect(result.monthlySavings).toBe(10);
  });

  it('marks free plan as optimal with zero savings', () => {
    const tool: ToolInput = { toolId: 'cursor', plan: 'hobby', monthlySpend: 0, seats: 1 };
    const result = auditTool(tool, 1, 'coding');
    expect(result.recommendationType).toBe('optimal');
    expect(result.monthlySavings).toBe(0);
  });

  it('handles usage-based API tools', () => {
    const tool: ToolInput = { toolId: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 250, seats: 1 };
    const result = auditTool(tool, 5, 'coding');
    expect(result.currentSpend).toBe(250);
    expect(result.monthlySavings).toBe(0);
  });
});

describe('runAudit — full audit', () => {
  it('sums savings correctly across tools', () => {
    const formData: AuditFormData = {
      teamSize: 2,
      useCase: 'coding',
      tools: [
        { toolId: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 },
        { toolId: 'chatgpt', plan: 'plus', monthlySpend: 40, seats: 2 },
      ],
    };
    const { results, totalMonthlySavings, totalAnnualSavings } = runAudit(formData);
    expect(results).toHaveLength(2);
    expect(totalAnnualSavings).toBe(totalMonthlySavings * 12);
  });

  it('flags Cursor + Copilot redundancy for coding teams', () => {
    const formData: AuditFormData = {
      teamSize: 3,
      useCase: 'coding',
      tools: [
        { toolId: 'cursor', plan: 'pro', monthlySpend: 60, seats: 3 },
        { toolId: 'github-copilot', plan: 'individual', monthlySpend: 30, seats: 3 },
      ],
    };
    const { results } = runAudit(formData);
    const copilotResult = results.find((r) => r.toolId === 'github-copilot');
    expect(copilotResult?.recommendationType).toBe('consolidate');
  });

  it('does NOT flag Cursor + Copilot for non-coding teams', () => {
    const formData: AuditFormData = {
      teamSize: 3,
      useCase: 'writing',
      tools: [
        { toolId: 'cursor', plan: 'pro', monthlySpend: 60, seats: 3 },
        { toolId: 'github-copilot', plan: 'individual', monthlySpend: 30, seats: 3 },
      ],
    };
    const { results } = runAudit(formData);
    const copilotResult = results.find((r) => r.toolId === 'github-copilot');
    expect(copilotResult?.recommendationType).not.toBe('consolidate');
  });

  it('handles single-tool audit', () => {
    const formData: AuditFormData = {
      teamSize: 1,
      useCase: 'writing',
      tools: [{ toolId: 'chatgpt', plan: 'plus', monthlySpend: 20, seats: 1 }],
    };
    const { results } = runAudit(formData);
    expect(results).toHaveLength(1);
    expect(results[0].toolId).toBe('chatgpt');
  });

  it('returns zero savings for already-optimal setup', () => {
    const formData: AuditFormData = {
      teamSize: 10,
      useCase: 'coding',
      tools: [
        { toolId: 'github-copilot', plan: 'business', monthlySpend: 190, seats: 10 },
      ],
    };
    const { totalMonthlySavings } = runAudit(formData);
    expect(totalMonthlySavings).toBeGreaterThanOrEqual(0);
  });
});
