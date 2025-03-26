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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, excerpt, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Start a transaction
    await query('BEGIN');

    try {
      // Update the post
      await query(
        `UPDATE posts 
         SET title = $1, content = $2, excerpt = $3, updated_at = NOW()
         WHERE id = $4`,
        [title, content, excerpt || '', params.id]
      );

      // Delete existing tag associations
      await query(
        'DELETE FROM post_tags WHERE post_id = $1',
        [params.id]
      );

      // Insert new tag associations
      if (Array.isArray(tags) && tags.length > 0) {
        for (const tagName of tags) {
          if (!tagName || typeof tagName !== 'string') continue;

          const trimmedTagName = tagName.trim();
          if (!trimmedTagName) continue;

          // Generate slug from tag name
          const slug = trimmedTagName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          // Get or create tag
          const tagResult = await query(
            `INSERT INTO tags (name, slug) 
             VALUES ($1, $2) 
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
             RETURNING id`,
            [trimmedTagName, slug]
          );
          const tagId = tagResult.rows[0].id;

          // Create post-tag association
          await query(
            `INSERT INTO post_tags (post_id, tag_id) 
             VALUES ($1, $2) 
             ON CONFLICT DO NOTHING`,
            [params.id, tagId]
          );
        }
      }

      await query('COMMIT');

      // Fetch the updated post with its tags
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

      return NextResponse.json(result.rows[0]);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
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

    try {
      // Delete tag associations first
      await query(
        'DELETE FROM post_tags WHERE post_id = $1',
        [params.id]
      );

      // Delete the post
      await query(
        'DELETE FROM posts WHERE id = $1',
        [params.id]
      );

      await query('COMMIT');
      return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 