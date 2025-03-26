import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  try {
    // First, ensure the active column exists
    await query(`
      DO $$ 
      BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'users' AND column_name = 'active') THEN
              ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
          END IF;
      END $$;
    `);

    // Then fetch users with the active field
    const result = await query(
      `
      SELECT 
        id,
        name,
        email,
        role,
        active,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    const result = await query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
      `,
      [name, email, password, role]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 