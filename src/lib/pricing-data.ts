// src/lib/pricing-data.ts
// Vendor pricing data — pulled from official vendor pages
// See PRICING_DATA.md for full citations and dates
// Last updated: May 22, 2026

import type { ToolPricing } from '@/types';

export const PRICING_DATA: ToolPricing[] = [
  {
    toolId: 'cursor',
    toolName: 'Cursor',
    logoEmoji: '⌨️',
    tiers: [
      { planId: 'hobby', planLabel: 'Hobby', pricePerSeat: 0, notes: 'Free tier, limited completions' },
      { planId: 'pro', planLabel: 'Pro', pricePerSeat: 20 },
      { planId: 'business', planLabel: 'Business', pricePerSeat: 40 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 60, notes: 'Estimated; contact sales' },
    ],
  },
  {
    toolId: 'github-copilot',
    toolName: 'GitHub Copilot',
    logoEmoji: '🐙',
    tiers: [
      { planId: 'individual', planLabel: 'Individual', pricePerSeat: 10 },
      { planId: 'business', planLabel: 'Business', pricePerSeat: 19 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 39 },
    ],
  },
  {
    toolId: 'claude',
    toolName: 'Claude (Anthropic)',
    logoEmoji: '🤖',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'pro', planLabel: 'Pro', pricePerSeat: 20 },
      { planId: 'max', planLabel: 'Max', pricePerSeat: 100 },
      { planId: 'team', planLabel: 'Team', pricePerSeat: 30, minSeats: 5 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 60, notes: 'Estimated; contact sales' },
      { planId: 'api', planLabel: 'API (Direct)', pricePerSeat: 0, notes: 'Pay-as-you-go usage' },
    ],
  },
  {
    toolId: 'chatgpt',
    toolName: 'ChatGPT (OpenAI)',
    logoEmoji: '💬',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'plus', planLabel: 'Plus', pricePerSeat: 20 },
      { planId: 'team', planLabel: 'Team', pricePerSeat: 30, minSeats: 2 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 60, notes: 'Estimated; contact sales' },
      { planId: 'api', planLabel: 'API (Direct)', pricePerSeat: 0, notes: 'Pay-as-you-go usage' },
    ],
  },
  {
    toolId: 'anthropic-api',
    toolName: 'Anthropic API',
    logoEmoji: '🔬',
    tiers: [
      { planId: 'pay-as-you-go', planLabel: 'Pay-as-you-go', pricePerSeat: 0, notes: 'Usage-based billing' },
    ],
  },
  {
    toolId: 'openai-api',
    toolName: 'OpenAI API',
    logoEmoji: '🔌',
    tiers: [
      { planId: 'pay-as-you-go', planLabel: 'Pay-as-you-go', pricePerSeat: 0, notes: 'Usage-based billing' },
    ],
  },
  {
    toolId: 'gemini',
    toolName: 'Google Gemini',
    logoEmoji: '✨',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'advanced', planLabel: 'Advanced', pricePerSeat: 20, notes: 'Google One AI Premium' },
      { planId: 'business', planLabel: 'Business', pricePerSeat: 30 },
      { planId: 'api', planLabel: 'API (Direct)', pricePerSeat: 0, notes: 'Pay-as-you-go usage' },
    ],
  },
  {
    toolId: 'windsurf',
    toolName: 'Windsurf (Codeium)',
    logoEmoji: '🏄',
    tiers: [
      { planId: 'free', planLabel: 'Free', pricePerSeat: 0 },
      { planId: 'pro', planLabel: 'Pro', pricePerSeat: 15 },
      { planId: 'teams', planLabel: 'Teams', pricePerSeat: 35, minSeats: 3 },
      { planId: 'enterprise', planLabel: 'Enterprise', pricePerSeat: 50, notes: 'Estimated; contact sales' },
    ],
  },
];

// Helper: get pricing for a specific tool
export function getToolPricing(toolId: string): ToolPricing | undefined {
  return PRICING_DATA.find((t) => t.toolId === toolId);
}

// Helper: get price per seat for a specific plan
export function getPlanPrice(toolId: string, planId: string): number {
  const tool = getToolPricing(toolId);
  if (!tool) return 0;
  const tier = tool.tiers.find((t) => t.planId === planId);
  return tier?.pricePerSeat ?? 0;
}

// Helper: get tool display name
export function getToolName(toolId: string): string {
  const tool = getToolPricing(toolId);
  return tool?.toolName ?? toolId;
}

// Helper: get tool emoji
export function getToolEmoji(toolId: string): string {
  const tool = getToolPricing(toolId);
  return tool?.logoEmoji ?? '🤖';
}
