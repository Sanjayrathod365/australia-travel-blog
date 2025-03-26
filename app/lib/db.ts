import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// Validate required environment variables
const requiredEnvVars = [
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_DATABASE'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
  release();
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rows });
    return res;
  } catch (error: any) {
    console.error('Error executing query', { 
      text, 
      error: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
    throw error;
  }
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Function to ensure schema is up to date
export async function ensureSchema() {
  try {
    const schemaPath = path.join(process.cwd(), 'app', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await query(schema);
    console.log('Schema updated successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
    throw error;
  }
}

// Run schema update when the module is imported
ensureSchema().catch(console.error);

export { pool };
export default { query }; 