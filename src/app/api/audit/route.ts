// src/app/api/audit/route.ts
// POST /api/audit — Run audit engine and save to Supabase

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Day 3/4: Full implementation
  // - Parse and validate request body (zod)
  // - Check rate limit (Upstash)
  // - Run audit engine
  // - Generate AI summary (Anthropic)
  // - Save to Supabase
  // - Return results

  return NextResponse.json(
    { error: 'Audit API — Coming Day 3' },
    { status: 501 }
  );
}
