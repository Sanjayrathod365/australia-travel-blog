require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

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

function splitSqlStatements(sql) {
  const statements = [];
  let currentStatement = '';
  let inFunction = false;
  let dollarQuoteTag = '';
  let inDollarQuote = false;

  // Split the SQL file into lines
  const lines = sql.split('\n');

  for (let line of lines) {
    line = line.trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('--')) {
      continue;
    }

    // Check for function definition start
    if (line.toUpperCase().includes('CREATE') && line.toUpperCase().includes('FUNCTION')) {
      inFunction = true;
    }

    // Check for dollar quotes
    if (line.includes('$$')) {
      if (!inDollarQuote) {
        inDollarQuote = true;
      } else {
        inDollarQuote = false;
        if (inFunction && line.toLowerCase().includes('language')) {
          inFunction = false;
        }
      }
    }

    currentStatement += line + '\n';

    // If we're not in a function or dollar quote and the line ends with a semicolon
    if (!inFunction && !inDollarQuote && line.endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }

  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }

  return statements;
}

async function runMigrations() {
  try {
    // Get all migration files
    const migrationsPath = path.join(process.cwd(), 'db', 'migrations');
    console.log('Reading migrations from:', migrationsPath);
    const files = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure consistent order

    console.log(`Found ${files.length} migration files`);

    // Execute each migration file
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      const statements = splitSqlStatements(sql);

      for (const statement of statements) {
        try {
          await pool.query(statement);
          console.log('Successfully executed statement:', statement.split('\n')[0]);
        } catch (error) {
          // Handle specific error codes
          if (error.code === '42P07') { // duplicate table
            console.log('Table already exists, continuing...');
            continue;
          }
          if (error.code === '42710') { // duplicate object (like trigger)
            console.log('Object already exists, continuing...');
            continue;
          }
          if (error.code === '42P04') { // duplicate database
            console.log('Database already exists, continuing...');
            continue;
          }
          
          console.error('Error executing statement:', statement.split('\n')[0]);
          console.error('Error details:', error);
          throw error;
        }
      }
      console.log(`Completed migration: ${file}`);
    }

    console.log('All migrations completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

// Run the migrations
runMigrations(); 