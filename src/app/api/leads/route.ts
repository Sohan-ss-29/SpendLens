// src/app/api/leads/route.ts
// POST /api/leads — Save lead capture to Supabase + send confirmation email

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Day 5: Full implementation
  // - Validate honeypot field
  // - Check rate limit
  // - Validate email (zod)
  // - Save to Supabase leads table
  // - Send confirmation email via Resend
  // - Return success

  return NextResponse.json(
    { error: 'Leads API — Coming Day 5' },
    { status: 501 }
  );
}
