// src/app/api/share/route.ts
// Creates a shareable, public URL for an audit result.
// Strips PII (email, company name) — only tools and savings numbers are public.
// Returns a nanoid share token which maps to /audit/[token]

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import { rateLimit } from '@/lib/rate-limit';

const shareSchema = z.object({
  auditId: z.string().optional(),
  // Public-safe audit snapshot (no PII)
  results: z.array(z.object({
    toolId: z.string(),
    toolName: z.string(),
    currentPlan: z.string(),
    currentSpend: z.number(),
    recommendationType: z.string(),
    recommendedAction: z.string(),
    projectedSpend: z.number(),
    monthlySavings: z.number(),
    annualSavings: z.number(),
    reason: z.string(),
    credexOpportunity: z.boolean().optional(),
    confidence: z.enum(['high', 'medium', 'low']),
  })),
  totalMonthlySavings: z.number(),
  totalAnnualSavings: z.number(),
  teamSize: z.number(),
  useCase: z.string(),
  toolCount: z.number(),
  aiSummary: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';

  const limit = await rateLimit(`share:${ip}`, 10, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = shareSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const shareToken = nanoid(21);

  // Persist to shared_audits table (no PII)
  try {
    const supabase = createServerClient();

    const { error } = await supabase.from('shared_audits').insert({
      share_token: shareToken,
      audit_id: data.auditId || null,
      results: data.results,
      total_monthly_savings: data.totalMonthlySavings,
      total_annual_savings: data.totalAnnualSavings,
      team_size: data.teamSize,
      use_case: data.useCase,
      tool_count: data.toolCount,
      ai_summary: data.aiSummary || null,
    });

    if (error) {
      console.error('[share] Supabase error:', error);
      // Continue — we still return the token; it just won't load from DB
    }
  } catch (err) {
    console.error('[share] Supabase unavailable:', err);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spendlens.credex.rocks';
  return NextResponse.json({
    shareToken,
    shareUrl: `${appUrl}/audit/${shareToken}`,
  });
}
