import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    const body = await request.json();
    const { active } = body;

    // Update user's active status
    const result = await query(
      `
      UPDATE users 
      SET active = $1, 
          updated_at = NOW() 
      WHERE id = $2 
      RETURNING id, name, email, role, active
      `,
      [active, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
} 