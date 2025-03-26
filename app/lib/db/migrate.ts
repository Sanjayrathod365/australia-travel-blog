import { query } from '../db';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'app/lib/db/migrations/001_create_blog_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await query(statement);
        console.log('Executed SQL statement successfully');
      } catch (error) {
        console.error('Error executing SQL statement:', error);
        // Continue with next statement even if one fails
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigrations();
} 