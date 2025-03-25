import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const result = await query(`
      SELECT 
        p.*,
        array_agg(DISTINCT c.name) as categories,
        array_agg(DISTINCT t.name) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
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

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, featured_image, author, categories, tags } = body;

    // Update the post
    await query(
      'UPDATE posts SET title = $1, slug = $2, excerpt = $3, content = $4, featured_image = $5, author = $6 WHERE id = $7',
      [title, slug, excerpt, content, featured_image, author, params.id]
    );

    // Delete existing relationships
    await query('DELETE FROM post_categories WHERE post_id = $1', [params.id]);
    await query('DELETE FROM post_tags WHERE post_id = $1', [params.id]);

    // Handle categories
    const categoryArray = categories.split(',').map(cat => cat.trim());
    for (const categoryName of categoryArray) {
      // Insert category if it doesn't exist
      const categoryResult = await query(
        'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [categoryName]
      );
      const categoryId = categoryResult.rows[0].id;

      // Create post-category relationship
      await query(
        'INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [params.id, categoryId]
      );
    }

    // Handle tags
    const tagArray = tags.split(',').map(tag => tag.trim());
    for (const tagName of tagArray) {
      // Insert tag if it doesn't exist
      const tagResult = await query(
        'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [tagName]
      );
      const tagId = tagResult.rows[0].id;

      // Create post-tag relationship
      await query(
        'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [params.id, tagId]
      );
    }

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
} 