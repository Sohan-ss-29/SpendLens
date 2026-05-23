// src/types/index.ts

export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type RecommendationType =
  | 'downgrade'
  | 'switch'
  | 'consolidate'
  | 'credits'
  | 'optimal';

export interface ToolInput {
  toolId: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
}

export interface AuditResult {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendationType: RecommendationType;
  recommendedAction: string;
  recommendedPlan?: string;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  credexOpportunity?: boolean;
  confidence: 'high' | 'medium' | 'low';
}

export interface Audit {
  id: string;
  toolsData: ToolInput[];
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  shareToken?: string;
  aiSummary?: string;
  teamSize: number;
  useCase: UseCase;
  createdAt: string;
}

export interface ToolPricingTier {
  planId: string;
  planLabel: string;
  pricePerSeat: number;
  minSeats?: number;
  maxSeats?: number;
  notes?: string;
}

export interface ToolPricing {
  toolId: ToolId;
  toolName: string;
  logoEmoji: string;
  color: string;
  tiers: ToolPricingTier[];
}
