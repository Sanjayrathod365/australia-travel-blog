import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config({ path: '.env.local' });

async function createDatabase() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.POSTGRES_DATABASE]
    );

    if (result.rows.length === 0) {
      // Database does not exist, create it
      await client.query(`CREATE DATABASE ${process.env.POSTGRES_DATABASE}`);
      console.log(`Database ${process.env.POSTGRES_DATABASE} created successfully`);
    } else {
      console.log(`Database ${process.env.POSTGRES_DATABASE} already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase(); 