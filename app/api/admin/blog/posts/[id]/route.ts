import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT 
        p.*,
        array_agg(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = $1
      GROUP BY p.id`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, status, published_at, category_id, tags, comments_enabled } = body;

    // Start a transaction
    await query('BEGIN');

    // Update the post
    const result = await query(
      `
      UPDATE posts
      SET 
        title = $1,
        slug = $2,
        content = $3,
        excerpt = $4,
        status = $5,
        published_at = $6,
        category_id = $7,
        comments_enabled = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
      `,
      [title, slug, content, excerpt, status, published_at, category_id, comments_enabled ?? true, params.id]
    );

    if (result.rows.length === 0) {
      await query('ROLLBACK');
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete existing tags
    await query(
      'DELETE FROM post_tags WHERE post_id = $1',
      [params.id]
    );

    // Insert new tags if provided
    if (tags && tags.length > 0) {
      for (const tagId of tags) {
        await query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
          [params.id, tagId]
        );
      }
    }

    await query('COMMIT');

    // Fetch the updated post with its tags
    const updatedPost = await query(
      `
      SELECT 
        p.*,
        array_agg(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [params.id]
    );

    return NextResponse.json(updatedPost.rows[0]);
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Start a transaction
    await query('BEGIN');

    // Delete post tags first
    await query(
      'DELETE FROM post_tags WHERE post_id = $1',
      [params.id]
    );

    // Delete the post
    const result = await query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [params.id]
    );

    if (result.rows.length === 0) {
      await query('ROLLBACK');
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await query('COMMIT');
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 