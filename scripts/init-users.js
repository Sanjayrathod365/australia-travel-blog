const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Set up environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Create a new pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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

async function initUsers() {
  try {
    // Drop the users table if it exists
    await query(`DROP TABLE IF EXISTS users CASCADE;`);

    // Create users table
    await query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Hash the default password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert default admin user
    await query(`
      INSERT INTO users (name, email, password)
      VALUES ('Admin', 'admin@example.com', $1)
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);

    console.log('Users table initialized successfully!');
  } catch (error) {
    console.error('Error initializing users table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the initialization function
initUsers()
  .then(() => {
    console.log('Users table initialization completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error initializing users table:', error);
    process.exit(1);
  }); 