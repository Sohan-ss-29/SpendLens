// src/types/index.ts
// Shared TypeScript types for the AI Spend Audit Tool

// ─── Tool IDs ──────────────────────────────────────────────────────────────
export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf';

// ─── Plan Types per Tool ───────────────────────────────────────────────────
export type CursorPlan = 'hobby' | 'pro' | 'business' | 'enterprise';
export type GithubCopilotPlan = 'individual' | 'business' | 'enterprise';
export type ClaudePlan = 'free' | 'pro' | 'max' | 'team' | 'enterprise' | 'api';
export type ChatGPTPlan = 'free' | 'plus' | 'team' | 'enterprise' | 'api';
export type AnthropicApiPlan = 'pay-as-you-go';
export type OpenAIApiPlan = 'pay-as-you-go';
export type GeminiPlan = 'free' | 'advanced' | 'business' | 'api';
export type WindsurfPlan = 'free' | 'pro' | 'teams' | 'enterprise';

export type PlanId =
  | CursorPlan
  | GithubCopilotPlan
  | ClaudePlan
  | ChatGPTPlan
  | AnthropicApiPlan
  | OpenAIApiPlan
  | GeminiPlan
  | WindsurfPlan;

// ─── Use Cases ─────────────────────────────────────────────────────────────
export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

// ─── Tool Input ────────────────────────────────────────────────────────────
export interface ToolInput {
  toolId: ToolId;
  plan: PlanId;
  monthlySpend: number; // USD
  seats: number;
}

// ─── Audit Form Data ───────────────────────────────────────────────────────
export interface AuditFormData {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
}

// ─── Audit Result ──────────────────────────────────────────────────────────
export type RecommendationType =
  | 'downgrade'
  | 'switch'
  | 'consolidate'
  | 'credits'
  | 'optimal';

export interface AuditResult {
  toolId: ToolId;
  toolName: string;
  currentPlan: PlanId;
  currentSpend: number;
  recommendationType: RecommendationType;
  recommendedAction: string;
  recommendedPlan?: PlanId;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  credexOpportunity?: boolean; // Show Credex CTA
  confidence: 'high' | 'medium' | 'low';
}

// ─── Full Audit ─────────────────────────────────────────────────────────────
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

// ─── Lead ───────────────────────────────────────────────────────────────────
export interface Lead {
  id: string;
  auditId: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  createdAt: string;
}

// ─── API Request/Response types ─────────────────────────────────────────────
export interface AuditRequest {
  formData: AuditFormData;
}

export interface AuditResponse {
  auditId: string;
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
}

export interface LeadRequest {
  auditId: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  // Honeypot field — must be empty
  website?: string;
}

export interface ShareResponse {
  shareToken: string;
  shareUrl: string;
}

// ─── Pricing Data ────────────────────────────────────────────────────────────
export interface ToolPricingTier {
  planId: PlanId;
  planLabel: string;
  pricePerSeat: number; // USD/month per seat
  minSeats?: number;
  maxSeats?: number;
  notes?: string;
}

export interface ToolPricing {
  toolId: ToolId;
  toolName: string;
  logoEmoji: string;
  tiers: ToolPricingTier[];
}
