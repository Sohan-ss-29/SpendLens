// src/lib/validations.ts
// Zod schemas for all form inputs and API requests

import { z } from 'zod';

// ─── Tool IDs ──────────────────────────────────────────────────────────────
export const toolIdSchema = z.enum([
  'cursor',
  'github-copilot',
  'claude',
  'chatgpt',
  'anthropic-api',
  'openai-api',
  'gemini',
  'windsurf',
]);

// ─── Use Case ──────────────────────────────────────────────────────────────
export const useCaseSchema = z.enum([
  'coding',
  'writing',
  'data',
  'research',
  'mixed',
]);

// ─── Tool Input ────────────────────────────────────────────────────────────
export const toolInputSchema = z.object({
  toolId: toolIdSchema,
  plan: z.string().min(1, 'Plan is required'),
  monthlySpend: z
    .number()
    .min(0, 'Spend must be 0 or more')
    .max(100000, 'Spend seems too high — double check'),
  seats: z
    .number()
    .int('Seats must be a whole number')
    .min(1, 'At least 1 seat required')
    .max(10000, 'Seat count seems too high'),
});

// ─── Audit Form ────────────────────────────────────────────────────────────
export const auditFormSchema = z.object({
  teamSize: z
    .number()
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(10000, 'Team size seems too large'),
  useCase: useCaseSchema,
  tools: z
    .array(toolInputSchema)
    .min(1, 'Add at least one tool to audit')
    .max(8, 'Maximum 8 tools per audit'),
});

// ─── API Audit Request ─────────────────────────────────────────────────────
export const auditRequestSchema = z.object({
  formData: auditFormSchema,
});

// ─── Lead Capture ──────────────────────────────────────────────────────────
export const leadRequestSchema = z.object({
  auditId: z.string().uuid('Invalid audit ID'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(320, 'Email is too long'),
  company: z.string().max(255).optional(),
  role: z.string().max(255).optional(),
  teamSize: z.number().int().min(1).max(10000).optional(),
  // Honeypot: must be empty. Bots fill this in.
  website: z.string().max(0, 'This field must be empty').optional(),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
export type ToolInputValues = z.infer<typeof toolInputSchema>;
export type LeadRequestValues = z.infer<typeof leadRequestSchema>;
