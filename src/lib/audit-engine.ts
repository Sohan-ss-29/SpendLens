// src/lib/audit-engine.ts
// Core audit logic — pure functions, no side effects

import type { AuditFormData, AuditResult, ToolInput, UseCase } from '@/types';
import { getPlanPrice, getToolName, isUsageBased, PRICING_DATA } from './pricing-data';

export function auditTool(
  tool: ToolInput,
  teamSize: number,
  useCase: UseCase
): AuditResult {
  const toolPricing = PRICING_DATA.find((t) => t.toolId === tool.toolId);
  const currentTier = toolPricing?.tiers.find((t) => t.planId === tool.plan);
  const isUsageBasedPlan = isUsageBased(tool.toolId, tool.plan);

  // For usage-based plans just report as-is, no seat logic
  if (isUsageBasedPlan) {
    return {
      toolId: tool.toolId,
      toolName: getToolName(tool.toolId),
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendationType: 'optimal',
      recommendedAction: 'Usage-based pricing — monitor monthly spend.',
      projectedSpend: tool.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'API/usage-based tools are billed per token. Consider Credex credits for bulk discounts.',
      credexOpportunity: tool.monthlySpend > 100,
      confidence: 'medium',
    };
  }

  const currentPricePerSeat = getPlanPrice(tool.toolId, tool.plan);
  const calculatedSpend = currentPricePerSeat * tool.seats;
  // Use inputted spend if plan is free or matches exactly, else trust their input
  const effectiveSpend = currentPricePerSeat === 0 ? tool.monthlySpend : Math.max(tool.monthlySpend, calculatedSpend);

  // ── Audit rules ──────────────────────────────────────────────────────────
  const tiers = toolPricing?.tiers ?? [];

  // 1. Free plan users — check if they're on free
  if (currentPricePerSeat === 0 && tool.plan !== 'api' && tool.plan !== 'pay-as-you-go') {
    return {
      toolId: tool.toolId,
      toolName: getToolName(tool.toolId),
      currentPlan: tool.plan,
      currentSpend: 0,
      recommendationType: 'optimal',
      recommendedAction: "You're on the free plan — no spend here.",
      projectedSpend: 0,
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'Free tier. If you hit limits, the next paid plan may be worth it.',
      confidence: 'high',
    };
  }

  // 2. Check for a cheaper same-vendor plan that fits team size
  const cheaperSameTier = tiers.find((tier) => {
    if (tier.planId === tool.plan) return false;
    if (tier.pricePerSeat >= currentPricePerSeat) return false;
    if (tier.pricePerSeat === 0) return false; // skip free
    if (tier.minSeats && tool.seats < tier.minSeats) return false;
    return true;
  });

  if (cheaperSameTier) {
    const projectedSpend = cheaperSameTier.pricePerSeat * tool.seats;
    const savings = effectiveSpend - projectedSpend;
    if (savings > 0) {
      return {
        toolId: tool.toolId,
        toolName: getToolName(tool.toolId),
        currentPlan: tool.plan,
        currentSpend: effectiveSpend,
        recommendationType: 'downgrade',
        recommendedAction: `Downgrade to ${cheaperSameTier.planLabel}`,
        recommendedPlan: cheaperSameTier.planId,
        projectedSpend,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `${cheaperSameTier.planLabel} covers ${tool.seats} seat${tool.seats > 1 ? 's' : ''} at $${cheaperSameTier.pricePerSeat}/seat — same core features for most teams.`,
        credexOpportunity: savings > 50,
        confidence: 'high',
      };
    }
  }

  // 3. Team-size checks — flag over-paying for plan tier
  if (tool.toolId === 'cursor') {
    if (tool.plan === 'business' && tool.seats === 1) {
      const proTier = tiers.find((t) => t.planId === 'pro')!;
      const savings = effectiveSpend - proTier.pricePerSeat;
      return {
        toolId: tool.toolId,
        toolName: getToolName(tool.toolId),
        currentPlan: tool.plan,
        currentSpend: effectiveSpend,
        recommendationType: 'downgrade',
        recommendedAction: 'Downgrade to Pro (solo user)',
        recommendedPlan: 'pro',
        projectedSpend: proTier.pricePerSeat,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: 'Business plan admin features are unnecessary for solo developers.',
        confidence: 'high',
      };
    }
  }

  if (tool.toolId === 'claude' && tool.plan === 'team' && tool.seats < 5) {
    const proTier = tiers.find((t) => t.planId === 'pro')!;
    const altSpend = proTier.pricePerSeat * tool.seats;
    const savings = effectiveSpend - altSpend;
    if (savings > 0) {
      return {
        toolId: tool.toolId,
        toolName: getToolName(tool.toolId),
        currentPlan: tool.plan,
        currentSpend: effectiveSpend,
        recommendationType: 'downgrade',
        recommendedAction: `Switch to ${tool.seats}× Pro plans`,
        recommendedPlan: 'pro',
        projectedSpend: altSpend,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `Claude Team requires min 5 seats ($${5 * 30}/mo minimum). ${tool.seats}× Pro at $${proTier.pricePerSeat}/seat = $${altSpend}/mo — cheaper for small teams.`,
        confidence: 'high',
      };
    }
  }

  if (tool.toolId === 'chatgpt' && tool.plan === 'team' && tool.seats <= 2) {
    const plusTier = tiers.find((t) => t.planId === 'plus')!;
    const altSpend = plusTier.pricePerSeat * tool.seats;
    const savings = effectiveSpend - altSpend;
    if (savings > 0) {
      return {
        toolId: tool.toolId,
        toolName: getToolName(tool.toolId),
        currentPlan: tool.plan,
        currentSpend: effectiveSpend,
        recommendationType: 'downgrade',
        recommendedAction: `Switch to ${tool.seats}× Plus plans`,
        recommendedPlan: 'plus',
        projectedSpend: altSpend,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `ChatGPT Team adds shared workspace — not worth extra $${30 - 20}/seat for teams of 1-2. Individual Plus gives same AI access.`,
        confidence: 'high',
      };
    }
  }

  // 4. Cross-tool: coding teams with both Cursor + Copilot
  // (handled at runAudit level below)

  // 5. Already optimal
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan,
    currentSpend: effectiveSpend,
    recommendationType: 'optimal',
    recommendedAction: "You're on the right plan.",
    projectedSpend: effectiveSpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `${getToolName(tool.toolId)} ${currentTier?.planLabel ?? tool.plan} is the best fit for ${tool.seats} seat${tool.seats > 1 ? 's' : ''}.`,
    confidence: 'high',
  };
}

export function runAudit(formData: AuditFormData): {
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
} {
  let results = formData.tools.map((tool) =>
    auditTool(tool, formData.teamSize, formData.useCase)
  );

  // Cross-tool: coding teams with BOTH Cursor and Copilot — flag redundancy
  if (formData.useCase === 'coding') {
    const hasCursor = formData.tools.find((t) => t.toolId === 'cursor' && t.plan !== 'hobby');
    const hasCopilot = formData.tools.find((t) => t.toolId === 'github-copilot');
    if (hasCursor && hasCopilot) {
      results = results.map((r) => {
        if (r.toolId === 'github-copilot' && r.recommendationType === 'optimal') {
          const savings = hasCopilot.monthlySpend || (getPlanPrice('github-copilot', hasCopilot.plan) * hasCopilot.seats);
          return {
            ...r,
            recommendationType: 'consolidate' as const,
            recommendedAction: 'Consider dropping Copilot — Cursor includes AI coding',
            projectedSpend: 0,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: 'Cursor already provides AI code completion. Running both Cursor Pro+ and Copilot is redundant for most teams.',
            credexOpportunity: false,
            confidence: 'medium' as const,
          };
        }
        return r;
      });
    }
  }

  const totalMonthlySavings = results.reduce((sum, r) => sum + r.monthlySavings, 0);

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}
