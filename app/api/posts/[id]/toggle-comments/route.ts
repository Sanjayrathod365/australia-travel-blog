import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { enabled } = await request.json();
    const postId = parseInt(params.id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const result = await db.query(
      'UPDATE posts SET comments_enabled = $1 WHERE id = $2 RETURNING *',
      [enabled, postId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 