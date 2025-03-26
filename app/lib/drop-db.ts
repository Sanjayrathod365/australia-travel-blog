import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config({ path: '.env.local' });

async function dropDatabase() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Terminate all connections to the database
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid();
    `, [process.env.POSTGRES_DATABASE]);

    // Drop the database
    await client.query(`DROP DATABASE IF EXISTS ${process.env.POSTGRES_DATABASE}`);
    console.log(`Database ${process.env.POSTGRES_DATABASE} dropped successfully`);
  } catch (error) {
    console.error('Error dropping database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

dropDatabase(); 