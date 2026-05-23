// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Leads API — coming Day 5' }, { status: 501 });
}
