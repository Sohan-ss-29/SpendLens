// src/lib/ai-summary.ts
import type { AuditResult, UseCase } from '@/types';

export interface SummaryContext {
  teamSize: number;
  useCase: UseCase;
  results: AuditResult[];
  totalMonthlySavings: number;
}

export async function generateAuditSummary(context: SummaryContext): Promise<string> {
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const topSavings = context.results
      .filter((r) => r.monthlySavings > 0)
      .sort((a, b) => b.monthlySavings - a.monthlySavings)
      .slice(0, 3)
      .map((r) => `${r.toolName}: ${r.recommendedAction} (saves $${r.monthlySavings.toFixed(0)}/mo)`)
      .join('; ');

    const prompt = `You are a financial advisor specializing in AI tool costs for startups.

Team profile:
- Size: ${context.teamSize} people
- Primary use case: ${context.useCase}
- Total monthly savings identified: $${context.totalMonthlySavings.toFixed(0)}
- Top recommendations: ${topSavings || 'Already spending efficiently'}

Write a 2-3 sentence personalized audit summary. Be specific about the dollar amount. Be direct and actionable. Do not use bullet points. Do not use jargon like "leverage" or "synergy".`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type === 'text') return content.text;
    return generateTemplateSummary(context);
  } catch {
    return generateTemplateSummary(context);
  }
}

export function generateTemplateSummary(context: SummaryContext): string {
  const { teamSize, useCase, totalMonthlySavings, results } = context;
  const annual = totalMonthlySavings * 12;

  if (totalMonthlySavings <= 0) {
    return `Your team of ${teamSize} is running a lean AI stack for ${useCase} work — no obvious savings found with current pricing. Revisit as your team scales or when vendor pricing changes.`;
  }

  const top = results.filter((r) => r.monthlySavings > 0).sort((a, b) => b.monthlySavings - a.monthlySavings)[0];
  return `Your team of ${teamSize} could save $${totalMonthlySavings.toFixed(0)}/month ($${annual.toFixed(0)}/year) on AI tools.${top ? ` The biggest win is ${top.toolName}: ${top.recommendedAction.toLowerCase()}.` : ''} For ${useCase}-focused teams, acting on these recommendations now locks in savings before vendor prices increase.`;
}
