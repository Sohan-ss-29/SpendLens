// src/lib/pricing-data.ts
import type { ToolPricing } from '@/types';

export const PRICING_DATA: ToolPricing[] = [
  {
    toolId: 'cursor',
    toolName: 'Cursor',
    logoEmoji: '⌨️',
    color: '#7C3AED',
    tiers: [
      { planId: 'hobby', planLabel: 'Hobby (Free)', pricePerSeat: 0, notes: 'Limited completions' },
      { planId: 'pro', planLabel: 'Pro', pricePerSeat: 20 },
      { planId: 'business', planLabel: 'Business', pricePerSeat: 40 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 60, notes: 'Contact sales' },
    ],
  },
  {
    toolId: 'github-copilot',
    toolName: 'GitHub Copilot',
    logoEmoji: '🐙',
    color: '#24292F',
    tiers: [
      { planId: 'individual', planLabel: 'Individual', pricePerSeat: 10 },
      { planId: 'business', planLabel: 'Business', pricePerSeat: 19 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 39 },
    ],
  },
  {
    toolId: 'claude',
    toolName: 'Claude',
    logoEmoji: '🤖',
    color: '#D97706',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'pro', planLabel: 'Pro', pricePerSeat: 20 },
      { planId: 'max', planLabel: 'Max', pricePerSeat: 100 },
      { planId: 'team', planLabel: 'Team', pricePerSeat: 30, minSeats: 5 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 60 },
      { planId: 'api', planLabel: 'API (Usage-based)', pricePerSeat: 0, notes: 'Enter monthly API spend' },
    ],
  },
  {
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    logoEmoji: '💬',
    color: '#10A37F',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'plus', planLabel: 'Plus', pricePerSeat: 20 },
      { planId: 'team', planLabel: 'Team', pricePerSeat: 30, minSeats: 2 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 60 },
      { planId: 'api', planLabel: 'API (Usage-based)', pricePerSeat: 0, notes: 'Enter monthly API spend' },
    ],
  },
  {
    toolId: 'anthropic-api',
    toolName: 'Anthropic API',
    logoEmoji: '🔬',
    color: '#D97706',
    tiers: [
      { planId: 'pay-as-you-go', planLabel: 'Pay-as-you-go', pricePerSeat: 0, notes: 'Enter your monthly spend' },
    ],
  },
  {
    toolId: 'openai-api',
    toolName: 'OpenAI API',
    logoEmoji: '🔌',
    color: '#10A37F',
    tiers: [
      { planId: 'pay-as-you-go', planLabel: 'Pay-as-you-go', pricePerSeat: 0, notes: 'Enter your monthly spend' },
    ],
  },
  {
    toolId: 'gemini',
    toolName: 'Google Gemini',
    logoEmoji: '✨',
    color: '#4285F4',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'advanced', planLabel: 'Advanced (AI Premium)', pricePerSeat: 20 },
      { planId: 'business', planLabel: 'Business (Workspace)', pricePerSeat: 30 },
      { planId: 'api', planLabel: 'API (Usage-based)', pricePerSeat: 0, notes: 'Enter monthly API spend' },
    ],
  },
  {
    toolId: 'windsurf',
    toolName: 'Windsurf',
    logoEmoji: '🏄',
    color: '#06B6D4',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'pro', planLabel: 'Pro', pricePerSeat: 15 },
      { planId: 'teams', planLabel: 'Teams', pricePerSeat: 35, minSeats: 3 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 50 },
    ],
  },
];

export function getToolPricing(toolId: string): ToolPricing | undefined {
  return PRICING_DATA.find((t) => t.toolId === toolId);
}

export function getPlanPrice(toolId: string, planId: string): number {
  const tool = getToolPricing(toolId);
  if (!tool) return 0;
  const tier = tool.tiers.find((t) => t.planId === planId);
  return tier?.pricePerSeat ?? 0;
}

export function getToolName(toolId: string): string {
  return getToolPricing(toolId)?.toolName ?? toolId;
}

export function getToolEmoji(toolId: string): string {
  return getToolPricing(toolId)?.logoEmoji ?? '🤖';
}

export function getToolColor(toolId: string): string {
  return getToolPricing(toolId)?.color ?? '#7C3AED';
}

export function isUsageBased(toolId: string, planId: string): boolean {
  return ['anthropic-api', 'openai-api'].includes(toolId) ||
    ['api', 'pay-as-you-go'].includes(planId);
}
