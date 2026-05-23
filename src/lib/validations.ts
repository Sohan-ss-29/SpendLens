// src/lib/validations.ts
import { z } from 'zod';

export const toolIdSchema = z.enum([
  'cursor', 'github-copilot', 'claude', 'chatgpt',
  'anthropic-api', 'openai-api', 'gemini', 'windsurf',
]);

export const useCaseSchema = z.enum(['coding', 'writing', 'data', 'research', 'mixed']);

export const toolInputSchema = z.object({
  toolId: toolIdSchema,
  plan: z.string().min(1, 'Select a plan'),
  monthlySpend: z.number({ message: 'Enter a valid amount' })
    .min(0, 'Must be 0 or more')
    .max(100000, 'Amount seems too high'),
  seats: z.number({ message: 'Enter a valid number' })
    .int('Must be a whole number')
    .min(1, 'At least 1 seat')
    .max(10000, 'Too many seats'),
});

export const auditFormSchema = z.object({
  teamSize: z.number({ message: 'Enter your team size' })
    .int()
    .min(1, 'At least 1 person')
    .max(10000, 'Team size too large'),
  useCase: useCaseSchema,
  tools: z.array(toolInputSchema)
    .min(1, 'Add at least one tool')
    .max(8, 'Maximum 8 tools'),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
export type ToolInputValues = z.infer<typeof toolInputSchema>;
