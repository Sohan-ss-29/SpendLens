// src/lib/local-db.ts
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), '.local-db.json');

interface DB {
  audits: any[];
  leads: any[];
  shared_audits: any[];
}

function readDB(): DB {
  if (!fs.existsSync(DB_FILE)) {
    return { audits: [], leads: [], shared_audits: [] };
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { audits: [], leads: [], shared_audits: [] };
  }
}

function writeDB(db: DB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// A generic mock client that acts like Supabase for local dev
export const localDbMock = {
  from: (table: keyof DB) => ({
    insert: (data: any) => {
      return {
        select: () => {
          return {
            single: async () => {
              const db = readDB();
              const record = { id: crypto.randomUUID(), ...data };
              if (!db[table]) db[table] = [];
              db[table].push(record);
              writeDB(db);
              return { data: record, error: null };
            }
          };
        },
        // Sometimes insert is called without select() chaining (like in share/route.ts)
        then: async (resolve: any) => {
            const db = readDB();
            const record = { id: crypto.randomUUID(), ...data };
            if (!db[table]) db[table] = [];
            db[table].push(record);
            writeDB(db);
            resolve({ data: record, error: null });
        }
      };
    },
    update: (data: any) => ({
      eq: async (column: string, value: any) => {
        const db = readDB();
        const tableData = db[table] || [];
        const index = tableData.findIndex((r: any) => r[column] === value);
        if (index !== -1) {
          tableData[index] = { ...tableData[index], ...data };
          writeDB(db);
        }
        return { data: null, error: null };
      }
    }),
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const db = readDB();
          const tableData = db[table] || [];
          const record = tableData.find((r: any) => r[column] === value);
          if (record) {
            return { data: record, error: null };
          }
          return { data: null, error: new Error('Not found') };
        }
      })
    })
  })
} as any;
