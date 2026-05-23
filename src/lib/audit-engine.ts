// src/lib/audit-engine.ts
// Core audit logic — pure functions, no side effects, fully testable
// Day 3: Full implementation with all per-tool rules + cross-tool analysis

import type { AuditFormData, AuditResult, ToolInput, UseCase } from '@/types';
import { getPlanPrice, getToolName, isUsageBased, PRICING_DATA } from './pricing-data';

// ─── Helper: build an "optimal" result ────────────────────────────────────────
function optimal(tool: ToolInput, spend: number, planLabel: string): AuditResult {
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan,
    currentSpend: spend,
    recommendationType: 'optimal',
    recommendedAction: "You're on the right plan.",
    projectedSpend: spend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `${getToolName(tool.toolId)} ${planLabel} is the best fit for your team size and use case.`,
    credexOpportunity: false,
    confidence: 'high',
  };
}

// ─── Helper: build a "downgrade" result ───────────────────────────────────────
function downgrade(
  tool: ToolInput,
  currentSpend: number,
  newPlanId: string,
  newPlanLabel: string,
  newSpend: number,
  reason: string,
  confidence: 'high' | 'medium' | 'low' = 'high'
): AuditResult {
  const savings = currentSpend - newSpend;
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan,
    currentSpend,
    recommendationType: 'downgrade',
    recommendedAction: `Downgrade to ${newPlanLabel}`,
    recommendedPlan: newPlanId,
    projectedSpend: newSpend,
    monthlySavings: Math.max(0, savings),
    annualSavings: Math.max(0, savings) * 12,
    reason,
    credexOpportunity: savings > 50,
    confidence,
  };
}

// ─── Main per-tool audit function ─────────────────────────────────────────────
export function auditTool(
  tool: ToolInput,
  teamSize: number,
  useCase: UseCase
): AuditResult {
  const toolPricing = PRICING_DATA.find((t) => t.toolId === tool.toolId);
  const currentTier = toolPricing?.tiers.find((t) => t.planId === tool.plan);
  const tiers = toolPricing?.tiers ?? [];

  // ── Usage-based tools (API direct) ─────────────────────────────────────
  if (isUsageBased(tool.toolId, tool.plan)) {
    const isHighSpend = tool.monthlySpend > 200;
    return {
      toolId: tool.toolId,
      toolName: getToolName(tool.toolId),
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendationType: 'optimal',
      recommendedAction: isHighSpend
        ? 'High API spend — consider Credex credits for 20–40% savings'
        : 'Usage-based pricing — monitor monthly spend.',
      projectedSpend: tool.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      reason: isHighSpend
        ? `At $${tool.monthlySpend}/mo in API spend, bulk credits through Credex could save $${Math.round(tool.monthlySpend * 0.25)}–$${Math.round(tool.monthlySpend * 0.4)}/mo.`
        : 'API/usage-based tools are billed per token. Track via your billing dashboard.',
      credexOpportunity: tool.monthlySpend > 100,
      confidence: isHighSpend ? 'high' : 'medium',
    };
  }

  const currentPricePerSeat = getPlanPrice(tool.toolId, tool.plan);
  // Trust their inputted spend; if it's 0 for a paid plan, use calculated
  const effectiveSpend =
    currentPricePerSeat === 0
      ? tool.monthlySpend
      : tool.monthlySpend > 0
        ? tool.monthlySpend
        : currentPricePerSeat * tool.seats;

  // ── Free plan ───────────────────────────────────────────────────────────
  if (currentPricePerSeat === 0) {
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
      reason: 'Free tier. Upgrade only if you consistently hit usage limits.',
      credexOpportunity: false,
      confidence: 'high',
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  // PER-TOOL RULES
  // ══════════════════════════════════════════════════════════════════════

  // ── CURSOR ──────────────────────────────────────────────────────────────
  if (tool.toolId === 'cursor') {
    // Solo dev on Business → Pro saves $20/seat
    if (tool.plan === 'business' && tool.seats === 1) {
      return downgrade(tool, effectiveSpend, 'pro', 'Pro', 20,
        'Business plan admin dashboard and privacy mode are overkill for solo developers. Pro gives unlimited completions.');
    }
    // Business for non-admin-heavy teams < 5 → Pro
    if (tool.plan === 'business' && tool.seats < 5 && useCase !== 'coding') {
      const proSpend = 20 * tool.seats;
      if (effectiveSpend > proSpend) {
        return downgrade(tool, effectiveSpend, 'pro', 'Pro', proSpend,
          `Small teams focused on ${useCase} rarely need Business-tier admin controls. Pro covers all AI features.`);
      }
    }
    // Enterprise for small teams → Business
    if (tool.plan === 'enterprise' && tool.seats < 20) {
      const bizSpend = 40 * tool.seats;
      if (effectiveSpend > bizSpend) {
        return downgrade(tool, effectiveSpend, 'business', 'Business', bizSpend,
          'Enterprise is designed for large orgs needing custom contracts and SSO. Business covers teams under 20.');
      }
    }
  }

  // ── GITHUB COPILOT ──────────────────────────────────────────────────────
  if (tool.toolId === 'github-copilot') {
    // Individual paying Business price → Individual plan
    if (tool.plan === 'business' && tool.seats === 1) {
      return downgrade(tool, effectiveSpend, 'individual', 'Individual', 10,
        'Business adds policy management and audit logs — not useful for solo developers. Individual plan is identical for personal use.');
    }
    // Enterprise for teams < 20 → Business
    if (tool.plan === 'enterprise' && tool.seats < 20) {
      const bizSpend = 19 * tool.seats;
      if (effectiveSpend > bizSpend) {
        return downgrade(tool, effectiveSpend, 'business', 'Business', bizSpend,
          'Copilot Enterprise adds IP indemnity and security features relevant only to large orgs. Business covers most startup needs.', 'medium');
      }
    }
  }

  // ── CLAUDE ───────────────────────────────────────────────────────────────
  if (tool.toolId === 'claude') {
    // Team plan with < 5 seats → individual Pro plans are cheaper
    if (tool.plan === 'team' && tool.seats < 5) {
      const proSpend = 20 * tool.seats;
      if (effectiveSpend > proSpend) {
        return downgrade(tool, effectiveSpend, 'pro', `${tool.seats}× Pro`, proSpend,
          `Claude Team requires a minimum of 5 seats ($150/mo minimum). ${tool.seats} individual Pro plans at $20/seat = $${proSpend}/mo — significantly cheaper for small teams.`);
      }
    }
    // Max plan for a team that has Team as an option → check if Team is cheaper
    if (tool.plan === 'max' && tool.seats >= 5) {
      const teamSpend = 30 * tool.seats;
      if (effectiveSpend > teamSpend) {
        return downgrade(tool, effectiveSpend, 'team', 'Team', teamSpend,
          `Claude Max ($100/seat) is for power users needing maximum rate limits. Team plan ($30/seat) covers standard team usage and adds shared Projects.`);
      }
    }
    // Solo Max user doing writing/research — check if Pro is enough
    if (tool.plan === 'max' && tool.seats === 1 && useCase !== 'coding') {
      return downgrade(tool, effectiveSpend, 'pro', 'Pro', 20,
        `Claude Max provides 5× the rate limits of Pro — valuable for heavy coding use but likely overkill for ${useCase}. Pro handles most ${useCase} workflows comfortably.`,
        'medium');
    }
    // Enterprise small team → Team
    if (tool.plan === 'enterprise' && tool.seats < 15) {
      const teamSpend = 30 * tool.seats;
      if (effectiveSpend > teamSpend) {
        return downgrade(tool, effectiveSpend, 'team', 'Team', teamSpend,
          'Claude Enterprise adds custom data retention and SSO — features mainly needed by companies with compliance requirements. Team plan covers startups well.');
      }
    }
  }

  // ── CHATGPT ──────────────────────────────────────────────────────────────
  if (tool.toolId === 'chatgpt') {
    // Team for 1–2 people → Plus is cheaper and nearly equivalent
    if (tool.plan === 'team' && tool.seats <= 2) {
      const plusSpend = 20 * tool.seats;
      if (effectiveSpend > plusSpend) {
        return downgrade(tool, effectiveSpend, 'plus', `${tool.seats}× Plus`, plusSpend,
          `ChatGPT Team adds shared workspace and admin controls. For ${tool.seats} person${tool.seats > 1 ? 's' : ''}, individual Plus accounts give identical AI access at $${plusSpend}/mo vs $${effectiveSpend}/mo.`);
      }
    }
    // Enterprise small team → Team
    if (tool.plan === 'enterprise' && tool.seats < 20) {
      const teamSpend = 30 * tool.seats;
      if (effectiveSpend > teamSpend) {
        return downgrade(tool, effectiveSpend, 'team', 'Team', teamSpend,
          'ChatGPT Enterprise adds advanced security, compliance, and dedicated capacity. Team plan covers most startup needs at a fraction of the price.', 'medium');
      }
    }
    // Plus for large team (10+) → should be on Team for shared context
    if (tool.plan === 'plus' && tool.seats >= 10) {
      const teamSpend = 30 * tool.seats;
      if (teamSpend < effectiveSpend) {
        return downgrade(tool, effectiveSpend, 'team', 'Team', teamSpend,
          'At 10+ seats, ChatGPT Team adds shared custom GPTs and admin controls that are worth the cost. But this only helps if Team is cheaper — check your current billing.');
      }
      // Team is more expensive, but flag the shared workspace opportunity
      return {
        ...optimal(tool, effectiveSpend, currentTier?.planLabel ?? tool.plan),
        recommendedAction: 'Consider ChatGPT Team for shared GPTs',
        reason: `Your team of ${tool.seats} could benefit from ChatGPT Team's shared workspace and custom GPTs, though it costs $${teamSpend}/mo vs your current $${effectiveSpend}/mo.`,
        confidence: 'low' as const,
      };
    }
  }

  // ── GEMINI ────────────────────────────────────────────────────────────────
  if (tool.toolId === 'gemini') {
    // Advanced (AI Premium) for non-Google-Workspace teams → check if needed
    if (tool.plan === 'advanced' && tool.seats === 1 && useCase === 'coding') {
      return {
        ...optimal(tool, effectiveSpend, 'Advanced'),
        recommendedAction: 'Consider switching to Claude or ChatGPT for coding',
        recommendationType: 'switch' as const,
        reason: 'Gemini Advanced is strong, but for coding-focused workflows, Claude and ChatGPT have more specialized coding tools and better IDE integrations. Worth testing alternatives.',
        confidence: 'medium' as const,
      };
    }
    // Business plan for teams not on Google Workspace → likely overpaying
    if (tool.plan === 'business' && !['coding', 'mixed'].includes(useCase)) {
      const advancedSpend = 20 * tool.seats;
      if (effectiveSpend > advancedSpend) {
        return downgrade(tool, effectiveSpend, 'advanced', 'Advanced (individual)', advancedSpend,
          `Gemini Business is bundled with Google Workspace. If your team primarily uses Gemini for ${useCase}, individual Advanced plans at $20/seat may be more cost-effective.`,
          'medium');
      }
    }
  }

  // ── WINDSURF ──────────────────────────────────────────────────────────────
  if (tool.toolId === 'windsurf') {
    // Teams plan for < 3 seats → individual Pro plans are cheaper
    if (tool.plan === 'teams' && tool.seats < 3) {
      const proSpend = 15 * tool.seats;
      if (effectiveSpend > proSpend) {
        return downgrade(tool, effectiveSpend, 'pro', `${tool.seats}× Pro`, proSpend,
          `Windsurf Teams requires a minimum of 3 seats. ${tool.seats} individual Pro plan${tool.seats > 1 ? 's' : ''} at $15/seat = $${proSpend}/mo — cheaper with equivalent coding capabilities.`);
      }
    }
    // Enterprise for small teams
    if (tool.plan === 'enterprise' && tool.seats < 15) {
      const teamsSpend = 35 * tool.seats;
      if (effectiveSpend > teamsSpend) {
        return downgrade(tool, effectiveSpend, 'teams', 'Teams', teamsSpend,
          'Windsurf Enterprise adds on-prem deployment and custom security — valuable for regulated industries but overkill for most startups.');
      }
    }
    // Solo dev on Teams → Pro
    if (tool.plan === 'teams' && tool.seats === 1) {
      return downgrade(tool, effectiveSpend, 'pro', 'Pro', 15,
        'Windsurf Teams is designed for groups with admin and collaboration features. Solo developers get everything they need from the Pro plan.');
    }
  }

  // ── Generic: cheaper same-vendor plan exists ────────────────────────────
  // Only suggest generic downgrade when the cheaper plan has no minimum seat
  // requirements that would disqualify it, AND the current plan is not a
  // "team" plan the user intentionally chose for collaboration features.
  const isTeamPlan = ['team', 'teams', 'business', 'enterprise'].includes(tool.plan);
  const cheaperTier = tiers.find((tier) => {
    if (tier.planId === tool.plan) return false;
    if (tier.pricePerSeat >= currentPricePerSeat) return false;
    if (tier.pricePerSeat === 0) return false;
    // Don't downgrade team plans if the team has enough seats
    if (isTeamPlan && currentTier?.minSeats && tool.seats >= currentTier.minSeats) return false;
    // Don't suggest plans that themselves have unmet min-seat requirements
    if (tier.minSeats && tool.seats < tier.minSeats) return false;
    return true;
  });

  if (cheaperTier) {
    const newSpend = cheaperTier.pricePerSeat * tool.seats;
    if (effectiveSpend - newSpend > 5) { // $5 threshold to avoid noise
      return downgrade(tool, effectiveSpend, cheaperTier.planId, cheaperTier.planLabel, newSpend,
        `${cheaperTier.planLabel} covers ${tool.seats} seat${tool.seats > 1 ? 's' : ''} at $${cheaperTier.pricePerSeat}/seat — covers the core features most teams use.`,
        'medium');
    }
  }

  // ── Credex opportunity for high-spend optimal plans ────────────────────
  if (effectiveSpend > 300 && ['anthropic-api', 'openai-api'].includes(tool.toolId)) {
    return {
      ...optimal(tool, effectiveSpend, currentTier?.planLabel ?? tool.plan),
      credexOpportunity: true,
      reason: `At $${effectiveSpend}/mo, Credex credits could save $${Math.round(effectiveSpend * 0.25)}–$${Math.round(effectiveSpend * 0.4)}/mo on this tool alone.`,
    };
  }

  return optimal(tool, effectiveSpend, currentTier?.planLabel ?? tool.plan);
}

// ─── Full audit runner ────────────────────────────────────────────────────────
export function runAudit(formData: AuditFormData): {
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
} {
  let results = formData.tools.map((tool) =>
    auditTool(tool, formData.teamSize, formData.useCase)
  );

  // ── Cross-tool rule 1: Cursor + GitHub Copilot (coding teams) ──────────
  if (formData.useCase === 'coding') {
    const cursorTool = formData.tools.find((t) => t.toolId === 'cursor' && t.plan !== 'hobby');
    const copilotTool = formData.tools.find((t) => t.toolId === 'github-copilot');

    if (cursorTool && copilotTool) {
      results = results.map((r) => {
        if (r.toolId === 'github-copilot') {
          const copilotSpend = copilotTool.monthlySpend > 0
            ? copilotTool.monthlySpend
            : getPlanPrice('github-copilot', copilotTool.plan) * copilotTool.seats;
          // Only flag if Copilot isn't already being downgraded for another reason
          if (r.recommendationType === 'optimal' || r.monthlySavings < copilotSpend) {
            return {
              ...r,
              recommendationType: 'consolidate' as const,
              recommendedAction: 'Consider dropping Copilot — Cursor already includes AI coding',
              projectedSpend: 0,
              monthlySavings: copilotSpend,
              annualSavings: copilotSpend * 12,
              reason: 'Cursor Pro/Business includes AI code completions, chat, and code generation. Running both Cursor and Copilot creates expensive redundancy — most coding teams pick one.',
              credexOpportunity: false,
              confidence: 'medium' as const,
            };
          }
        }
        return r;
      });
    }
  }

  // ── Cross-tool rule 2: Claude + ChatGPT both on paid plans (non-coding) ─
  if (['writing', 'research', 'data'].includes(formData.useCase)) {
    const claudeTool = formData.tools.find((t) => t.toolId === 'claude' && !['free', 'api'].includes(t.plan));
    const chatgptTool = formData.tools.find((t) => t.toolId === 'chatgpt' && !['free', 'api'].includes(t.plan));

    if (claudeTool && chatgptTool) {
      // Flag the cheaper one as a potential cut — suggest keeping the better-fit one
      const claudeSpend = claudeTool.monthlySpend || (getPlanPrice('claude', claudeTool.plan) * claudeTool.seats);
      const chatgptSpend = chatgptTool.monthlySpend || (getPlanPrice('chatgpt', chatgptTool.plan) * chatgptTool.seats);
      const dropId = claudeSpend <= chatgptSpend ? 'chatgpt' : 'claude';
      const keepName = dropId === 'chatgpt' ? 'Claude' : 'ChatGPT';
      const dropSpend = dropId === 'chatgpt' ? chatgptSpend : claudeSpend;

      results = results.map((r) => {
        if (r.toolId === dropId && r.recommendationType === 'optimal') {
          return {
            ...r,
            recommendationType: 'consolidate' as const,
            recommendedAction: `Consider consolidating to ${keepName} only`,
            projectedSpend: 0,
            monthlySavings: dropSpend,
            annualSavings: dropSpend * 12,
            reason: `For ${formData.useCase} workflows, most teams standardize on one LLM. ${keepName} handles your use case well — running both creates unnecessary cost.`,
            confidence: 'low' as const,
          };
        }
        return r;
      });
    }
  }

  // ── Cross-tool rule 3: Cursor + Windsurf (both AI IDEs) ─────────────────
  if (formData.useCase === 'coding') {
    const hasCursor = formData.tools.find((t) => t.toolId === 'cursor' && t.plan !== 'hobby');
    const hasWindsurf = formData.tools.find((t) => t.toolId === 'windsurf' && t.plan !== 'free');

    if (hasCursor && hasWindsurf) {
      const windsurfSpend = hasWindsurf.monthlySpend || (getPlanPrice('windsurf', hasWindsurf.plan) * hasWindsurf.seats);
      results = results.map((r) => {
        if (r.toolId === 'windsurf' && r.recommendationType === 'optimal') {
          return {
            ...r,
            recommendationType: 'consolidate' as const,
            recommendedAction: 'Drop Windsurf — Cursor and Windsurf are redundant',
            projectedSpend: 0,
            monthlySavings: windsurfSpend,
            annualSavings: windsurfSpend * 12,
            reason: 'Cursor and Windsurf are both AI-first IDEs with overlapping features. Running both doubles your AI IDE cost. Pick the one your team prefers.',
            confidence: 'high' as const,
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
