// src/app/api/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Audit API — coming Day 3' }, { status: 501 });
}
