import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import db from './db';

dotenv.config({ path: '.env.local' });

interface PostgresError extends Error {
  code?: string;
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
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

async function runMigrations(): Promise<void> {
  try {
    // Get all migration files
    const migrationsPath = path.join(process.cwd(), 'db', 'migrations');
    console.log('Reading migrations from:', migrationsPath);
    const files: string[] = fs.readdirSync(migrationsPath)
      .filter((file: string) => file.endsWith('.sql'))
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
          await db.query(statement);
          console.log('Successfully executed statement:', statement.split('\n')[0]);
        } catch (error: any) {
          const pgError = error as PostgresError;
          
          // Handle specific error codes
          if (pgError.code === '42P07') { // duplicate table
            console.log('Table already exists, continuing...');
            continue;
          }
          if (pgError.code === '42710') { // duplicate object (like trigger)
            console.log('Object already exists, continuing...');
            continue;
          }
          if (pgError.code === '42P04') { // duplicate database
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

  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

// Run the migrations
runMigrations(); 