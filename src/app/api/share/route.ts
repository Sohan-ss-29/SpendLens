// src/app/api/share/route.ts
// POST /api/share — Generate share token for an audit

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Day 5: Full implementation
  // - Validate auditId
  // - Generate nanoid() share token
  // - Update audit record with share_token
  // - Return shareable URL

  return NextResponse.json(
    { error: 'Share API — Coming Day 5' },
    { status: 501 }
  );
}
