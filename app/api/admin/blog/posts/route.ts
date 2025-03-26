import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/app/lib/db';
import { 
  listBlogPosts, 
  createBlogPost, 
  BlogPostFilters 
} from '@/app/lib/blogDb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function auth() {
  try {
    // Get admin token from cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    
    if (!sessionId) {
      return null;
    }

    // Verify session in database
    const result = await query(
      'SELECT * FROM admin_sessions WHERE id = $1 AND expires_at > NOW()',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function GET() {
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
      GROUP BY p.id
      ORDER BY p.updated_at DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, tags, comments_enabled } = body;

    // Generate slug from title if not provided
    const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const result = await query(
      `INSERT INTO posts (title, slug, content, excerpt, comments_enabled)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, slug, content, excerpt, comments_enabled ?? true]
    );

    const post = result.rows[0];

    // Handle tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Insert or get tag
        const tagResult = await query(
          `INSERT INTO tags (name) VALUES ($1)
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [tagName]
        );
        const tagId = tagResult.rows[0].id;

        // Create post-tag relationship
        await query(
          `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [post.id, tagId]
        );
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 