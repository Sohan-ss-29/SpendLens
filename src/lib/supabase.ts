// src/lib/supabase.ts
// Supabase client initialization
// Uses NEXT_PUBLIC_ vars for browser client, service role for server-only operations

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser-safe client (uses anon key, subject to RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only admin client (uses service role key, bypasses RLS)
// Only import this in server-side code (API routes, server components)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ─── Supabase SQL Schema ──────────────────────────────────────────────────
// Run this in Supabase SQL Editor to set up the database:
//
// -- audits table
// CREATE TABLE audits (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   tools_data JSONB NOT NULL,
//   results JSONB NOT NULL,
//   total_monthly_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
//   total_annual_savings DECIMAL(10,2) GENERATED ALWAYS AS (total_monthly_savings * 12) STORED,
//   share_token VARCHAR(21) UNIQUE,
//   ai_summary TEXT,
//   team_size INTEGER,
//   use_case VARCHAR(50),
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// -- leads table
// CREATE TABLE leads (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
//   email VARCHAR(320) NOT NULL,
//   company VARCHAR(255),
//   role VARCHAR(255),
//   team_size INTEGER,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// -- Indexes for performance
// CREATE INDEX idx_audits_share_token ON audits(share_token);
// CREATE INDEX idx_leads_audit_id ON leads(audit_id);
// CREATE INDEX idx_leads_email ON leads(email);
//
// -- Enable Row Level Security
// ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
// ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
//
// -- Public can read audits (for shareable URLs)
// CREATE POLICY "Public audits are viewable by everyone"
//   ON audits FOR SELECT USING (true);
//
// -- Only service role can insert/update audits
// CREATE POLICY "Service role can insert audits"
//   ON audits FOR INSERT WITH CHECK (true);
//
// -- Leads are private (service role only)
// CREATE POLICY "Only service role can access leads"
//   ON leads USING (false);
