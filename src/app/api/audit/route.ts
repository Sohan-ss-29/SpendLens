// src/app/api/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auditFormSchema } from '@/lib/validations';
import { runAudit } from '@/lib/audit-engine';
import { generateAuditSummary } from '@/lib/ai-summary';
import { createServerClient } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Validate incoming data
    const parsed = auditFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
    }
    const data = parsed.data;

    // 2. Run the core audit engine
    const auditResult = runAudit(data);

    // 3. Generate AI summary
    const aiSummary = await generateAuditSummary({
      teamSize: data.teamSize,
      useCase: data.useCase,
      results: auditResult.results,
      totalMonthlySavings: auditResult.totalMonthlySavings,
    });

    const fullResult = {
      formData: data,
      ...auditResult,
      aiSummary,
      createdAt: new Date().toISOString(),
    };

    // 4. Save to Supabase
    let id = randomUUID();
    try {
      const supabase = createServerClient();
      const { data: dbData, error } = await supabase
        .from('audits')
        .insert({
          form_data: data,
          results: auditResult.results,
          total_monthly_savings: auditResult.totalMonthlySavings,
          total_annual_savings: auditResult.totalAnnualSavings,
          ai_summary: aiSummary,
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
      } else if (dbData?.id) {
        id = dbData.id;
      }
    } catch (e) {
      // If Supabase keys aren't set yet (Day 4/5 transition), log and continue
      console.warn('Supabase not configured or failed:', e);
    }

    // 5. Return everything to client
    return NextResponse.json({ id, ...fullResult });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
