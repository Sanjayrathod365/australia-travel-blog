import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, featured_image, author, categories, tags } = body;

    // Insert the post
    const postResult = await query(
      'INSERT INTO posts (title, slug, excerpt, content, featured_image, author, published_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id',
      [title, slug, excerpt, content, featured_image, author]
    );
    const postId = postResult.rows[0].id;

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
        [postId, categoryId]
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
        [postId, tagId]
      );
    }

    return NextResponse.json({ message: 'Post created successfully', id: postId });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Delete post relationships first
    await query('DELETE FROM post_categories WHERE post_id = $1', [id]);
    await query('DELETE FROM post_tags WHERE post_id = $1', [id]);
    
    // Delete the post
    await query('DELETE FROM posts WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 