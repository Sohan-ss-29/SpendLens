// src/app/api/leads/route.ts
// Lead capture endpoint — called after user sees their audit results.
// Stores lead in Supabase, sends confirmation email via Resend.
// Abuse protection: rate limit (5/min per IP) + honeypot field.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase';
import { sendAuditConfirmationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';

// ── Validation schema ────────────────────────────────────────────────────────
const leadsSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  companyName: z.string().max(120).optional(),
  role: z.string().max(80).optional(),
  teamSize: z.number().int().positive().max(100_000).optional(),
  auditId: z.string().uuid().optional(), // Supabase UUID of the saved audit
  totalMonthlySavings: z.number().min(0),
  totalAnnualSavings: z.number().min(0),
  toolCount: z.number().int().positive(),
  // Honeypot field — bots fill this in, humans don't see it
  website: z.string().max(0, { message: 'Bot detected.' }).optional(),
});

export async function POST(request: NextRequest) {
  // ── Rate limit by IP ────────────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const limit = await rateLimit(`leads:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  // ── Parse + validate ─────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = leadsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const {
    email,
    companyName,
    role,
    teamSize,
    auditId,
    totalMonthlySavings,
    totalAnnualSavings,
    toolCount,
    website, // honeypot
  } = parsed.data;

  // ── Honeypot check ───────────────────────────────────────────────────────────
  if (website && website.length > 0) {
    // Silently accept but don't store — bot behaviour
    return NextResponse.json({ ok: true });
  }

  const isHighValue = totalMonthlySavings > 500;

  // Generate a share token for the public URL
  const shareToken = nanoid(21);

  // ── Persist to Supabase ──────────────────────────────────────────────────────
  let leadId: string | null = null;
  try {
    const supabase = createServerClient();

    // 1. Insert lead record
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert({
        email,
        company_name: companyName || null,
        role: role || null,
        team_size: teamSize || null,
        audit_id: auditId || null,
        total_monthly_savings: totalMonthlySavings,
        total_annual_savings: totalAnnualSavings,
        is_high_value: isHighValue,
        share_token: shareToken,
      })
      .select('id')
      .single();

    if (leadError) {
      console.error('[leads] Supabase insert error:', leadError);
    } else {
      leadId = leadData?.id ?? null;
    }

    // 2. Update the audit record with the share token (if auditId provided)
    if (auditId) {
      const { error: updateError } = await supabase
        .from('audits')
        .update({ share_token: shareToken, lead_email: email })
        .eq('id', auditId);

      if (updateError) {
        console.error('[leads] Audit update error:', updateError);
      }
    }
  } catch (err) {
    console.error('[leads] Supabase unavailable:', err);
    // Continue — email still goes out
  }

  // ── Send confirmation email ──────────────────────────────────────────────────
  const emailSent = await sendAuditConfirmationEmail({
    email,
    companyName,
    totalMonthlySavings,
    totalAnnualSavings,
    shareToken,
    toolCount,
    isHighValue,
  });

  return NextResponse.json({
    ok: true,
    leadId,
    shareToken,
    emailSent,
    isHighValue,
  });
}
