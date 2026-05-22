// src/lib/audit-engine.ts
// Core audit logic — pure functions, no side effects
// Full implementation in Day 3. Stubs here for type safety during Day 1/2.

import type { AuditFormData, AuditResult, ToolInput, UseCase } from '@/types';
import { getPlanPrice, getToolName, getToolEmoji } from './pricing-data';

// ─── Main audit function ────────────────────────────────────────────────────
export function auditTool(
  tool: ToolInput,
  teamSize: number,
  useCase: UseCase
): AuditResult {
  const currentPlanPrice = getPlanPrice(tool.toolId, tool.plan);
  const totalCurrentSpend = tool.monthlySpend;

  // Stub: returns "optimal" for everything until Day 3
  // This allows the app to be runnable end-to-end on Day 2
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan as AuditResult['currentPlan'],
    currentSpend: totalCurrentSpend,
    recommendationType: 'optimal',
    recommendedAction: 'Your current setup looks good.',
    projectedSpend: totalCurrentSpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Full audit logic coming in Day 3.',
    confidence: 'low',
  };
}

// ─── Run full audit ────────────────────────────────────────────────────────
export function runAudit(formData: AuditFormData): {
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
} {
  const results = formData.tools.map((tool) =>
    auditTool(tool, formData.teamSize, formData.useCase)
  );

  const totalMonthlySavings = results.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}
