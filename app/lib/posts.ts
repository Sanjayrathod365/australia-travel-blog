import { query } from './db';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: number;
  category_id: number | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_name: string;
  category_name: string | null;
  category_slug: string | null;
  tag_count: number;
}

export async function getPosts(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const result = await query(`
    SELECT 
      p.*,
      u.name as author_name,
      c.name as category_name,
      c.slug as category_slug,
      COUNT(DISTINCT pt.tag_id) as tag_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    GROUP BY p.id, u.name, c.name, c.slug
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  return result.rows;
}

export async function getPostBySlug(slug: string) {
  const result = await query(`
    SELECT 
      p.*,
      u.name as author_name,
      c.name as category_name,
      c.slug as category_slug,
      COUNT(DISTINCT pt.tag_id) as tag_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    WHERE p.slug = $1
    GROUP BY p.id, u.name, c.name, c.slug
  `, [slug]);

  return result.rows[0];
}

export async function getPostsByCategory(categorySlug: string, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const result = await query(`
    SELECT 
      p.*,
      u.name as author_name,
      c.name as category_name,
      c.slug as category_slug,
      COUNT(DISTINCT pt.tag_id) as tag_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    WHERE c.slug = $1
    GROUP BY p.id, u.name, c.name, c.slug
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
  `, [categorySlug, limit, offset]);

  return result.rows;
}

export async function getPostsByTag(tagSlug: string, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const result = await query(`
    SELECT 
      p.*,
      u.name as author_name,
      c.name as category_name,
      c.slug as category_slug,
      COUNT(DISTINCT pt.tag_id) as tag_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE t.slug = $1
    GROUP BY p.id, u.name, c.name, c.slug
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
  `, [tagSlug, limit, offset]);

  return result.rows;
} 