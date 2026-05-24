// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const isMock = supabaseUrl === 'https://placeholder.supabase.co';

// A generic mock client that just returns success without making network calls
const mockClient = {
  from: () => ({
    insert: () => ({ select: () => ({ single: async () => ({ data: { id: 'mock-id' }, error: null }) }) }),
    update: () => ({ eq: async () => ({ data: null, error: null }) }),
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) })
  })
} as any;

export const supabase = isMock ? mockClient : createClient(supabaseUrl, supabaseAnonKey);

export function createServerClient() {
  if (isMock) return mockClient;
  
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
