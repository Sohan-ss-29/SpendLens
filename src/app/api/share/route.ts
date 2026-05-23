// src/app/api/share/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Share API — coming Day 5' }, { status: 501 });
}
