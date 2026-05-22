// src/lib/ai-summary.ts
// Anthropic API wrapper for generating personalized audit summaries
// Full implementation in Day 4 — stub here for type safety

import type { AuditResult, UseCase } from '@/types';

export interface SummaryContext {
  teamSize: number;
  useCase: UseCase;
  results: AuditResult[];
  totalMonthlySavings: number;
}

// Generate a ~100 word personalized audit summary using claude-haiku-3
// Falls back to template string if API fails
export async function generateAuditSummary(
  context: SummaryContext
): Promise<string> {
  try {
    // Day 4: Implement full Anthropic API call
    // const response = await anthropic.messages.create({ ... });
    throw new Error('AI summary — Full implementation coming Day 4');
  } catch (error) {
    // Graceful fallback to template
    return generateTemplateSummary(context);
  }
}

// Template fallback — always works, no API required
export function generateTemplateSummary(context: SummaryContext): string {
  const { teamSize, useCase, totalMonthlySavings } = context;
  const annualSavings = totalMonthlySavings * 12;

  if (totalMonthlySavings <= 0) {
    return `Your team of ${teamSize} is running a lean AI stack for ${useCase} work — no obvious wins found. Consider revisiting as your team grows or as vendor pricing changes.`;
  }

  const highestSaving = context.results
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  return `Your team of ${teamSize} could save $${totalMonthlySavings.toFixed(0)}/month ($${annualSavings.toFixed(0)}/year) on AI tools. ${
    highestSaving
      ? `The biggest opportunity is ${highestSaving.toolName}: ${highestSaving.recommendedAction.toLowerCase()}.`
      : ''
  } For ${useCase}-focused teams, the recommendations above prioritize tools with the best performance-to-cost ratio. Acting on these today locks in savings before vendor prices increase.`;
}
