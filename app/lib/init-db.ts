import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { query } from './db';

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

async function initializeDatabase() {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'app', 'lib', 'schema.sql');
    console.log('Reading schema from:', schemaPath);
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split and execute statements
    const statements = splitSqlStatements(schema);
    console.log(`Found ${statements.length} SQL statements to execute`);

    for (const statement of statements) {
      try {
        await query(statement);
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

    console.log('Database schema initialized successfully');

    // Create default admin user
    const hashedPassword = '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9.m'; // "admin123"
    const createAdminQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `;
    
    const adminResult = await query(createAdminQuery, [
      'Admin User',
      'admin@example.com',
      hashedPassword,
      'admin'
    ]);

    if (adminResult.rows.length > 0) {
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 