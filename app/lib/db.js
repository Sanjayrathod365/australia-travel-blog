// lib/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL!');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    return false;
  }
}

// Initialize the connection
testConnection();

// Helper function to handle database queries
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Helper function to get a single row
async function getRow(text, params) {
  const res = await query(text, params);
  return res.rows[0];
}

// Helper function to get multiple rows
async function getRows(text, params) {
  const res = await query(text, params);
  return res.rows;
}

export { pool, query, getRow, getRows };
