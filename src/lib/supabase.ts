// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const isMock = supabaseUrl === 'https://placeholder.supabase.co';

import { localDbMock } from './local-db';

// A generic mock client that just returns success without making network calls
const mockClient = localDbMock;

export const supabase = isMock ? mockClient : createClient(supabaseUrl, supabaseAnonKey);

export function createServerClient() {
  if (isMock) return mockClient;
  
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
