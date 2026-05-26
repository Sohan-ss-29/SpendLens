// src/lib/local-db.ts
// Local JSON-file database that mimics the Supabase client API for local development.
// When NEXT_PUBLIC_SUPABASE_URL is the placeholder, this file is used instead.
// Data is persisted to .local-db.json in the project root.

import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), '.local-db.json');

interface DB {
  audits: Record<string, unknown>[];
  leads: Record<string, unknown>[];
  shared_audits: Record<string, unknown>[];
}

export function readDB(): DB {
  if (!fs.existsSync(DB_FILE)) {
    return { audits: [], leads: [], shared_audits: [] };
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DB>;
    return {
      audits: parsed.audits ?? [],
      leads: parsed.leads ?? [],
      shared_audits: parsed.shared_audits ?? [],
    };
  } catch {
    return { audits: [], leads: [], shared_audits: [] };
  }
}

function writeDB(db: DB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// ── Chainable query builder ────────────────────────────────────────────────────

function makeQueryBuilder(table: keyof DB) {
  return {
    // INSERT
    insert(record: Record<string, unknown>) {
      const db = readDB();
      const newRecord = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...record };
      if (!db[table]) (db as any)[table] = [];
      (db[table] as any[]).push(newRecord);
      writeDB(db);

      // Return a builder that supports .select().single() OR just being awaited
      const insertResult = { data: newRecord, error: null };
      return {
        select: () => ({
          single: async () => insertResult,
          // Allows `await supabase.from(...).insert(...).select('id').single()`
        }),
        // Allows `await supabase.from(...).insert({...})` directly
        then: (resolve: (v: typeof insertResult) => void) => {
          resolve(insertResult);
          return Promise.resolve(insertResult);
        },
      };
    },

    // UPDATE ... .eq(col, val)
    update(updates: Record<string, unknown>) {
      return {
        eq: async (column: string, value: unknown) => {
          const db = readDB();
          const rows = db[table] as Record<string, unknown>[];
          const idx = rows.findIndex((r) => r[column] === value);
          if (idx !== -1) {
            rows[idx] = { ...rows[idx], ...updates };
            writeDB(db);
          }
          return { data: null, error: null };
        },
      };
    },

    // SELECT ... .eq(col, val).single()
    select(_cols?: string) {
      return {
        eq: (column: string, value: unknown) => ({
          single: async () => {
            const db = readDB();
            const rows = db[table] as Record<string, unknown>[];
            const found = rows.find((r) => r[column] === value);
            if (found) return { data: found, error: null };
            return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
          },
        }),
      };
    },
  };
}

// The exported mock — drop-in replacement for supabase client in local dev
export const localDbMock = {
  from: (table: string) => makeQueryBuilder(table as keyof DB),
} as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient>;
