import { query } from './db';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  categories: string[];
  tags: string[];
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const result = await query(
      `SELECT 
        p.*,
        array_agg(DISTINCT c.name) as categories,
        array_agg(DISTINCT t.name) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.slug = $1
      GROUP BY p.id`,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const post = result.rows[0];
    return {
      ...post,
      categories: post.categories.filter(Boolean),
      tags: post.tags.filter(Boolean),
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const result = await query(
      `SELECT 
        p.*,
        array_agg(DISTINCT c.name) as categories,
        array_agg(DISTINCT t.name) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.published_at DESC`
    );

    return result.rows.map((post: Post) => ({
      ...post,
      categories: post.categories.filter(Boolean),
      tags: post.tags.filter(Boolean),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  try {
    const result = await query(
      `SELECT 
        p.*,
        array_agg(DISTINCT c.name) as categories,
        array_agg(DISTINCT t.name) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE c.slug = $1
      GROUP BY p.id
      ORDER BY p.published_at DESC`,
      [categorySlug]
    );

    return result.rows.map((post: Post) => ({
      ...post,
      categories: post.categories.filter(Boolean),
      tags: post.tags.filter(Boolean),
    }));
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw error;
  }
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  try {
    const result = await query(
      `SELECT 
        p.*,
        array_agg(DISTINCT c.name) as categories,
        array_agg(DISTINCT t.name) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE t.slug = $1
      GROUP BY p.id
      ORDER BY p.published_at DESC`,
      [tagSlug]
    );

    return result.rows.map((post: Post) => ({
      ...post,
      categories: post.categories.filter(Boolean),
      tags: post.tags.filter(Boolean),
    }));
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    throw error;
  }
} 