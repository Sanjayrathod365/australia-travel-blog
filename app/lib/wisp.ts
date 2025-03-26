import { query } from './db';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  image?: string;
  publishedAt?: string;
  updatedAt: string;
  author?: {
    name: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface GetPostsOptions {
  limit?: number;
  tags?: string[];
  exclude?: number[];
  status?: 'draft' | 'published';
}

interface GetPostResult {
  post: BlogPost | null;
}

interface GetPostsResult {
  posts: BlogPost[];
  total: number;
}

class WispService {
  async getPost(slug: string): Promise<GetPostResult> {
    try {
      const result = await query(`
        SELECT 
          p.*,
          u.name as author_name,
          json_agg(json_build_object(
            'id', t.id,
            'name', t.name,
            'slug', t.slug
          )) FILTER (WHERE t.id IS NOT NULL) as tags
        FROM blog_posts p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
        LEFT JOIN blog_tags t ON pt.tag_id = t.id
        WHERE p.slug = $1
        GROUP BY p.id, u.name
      `, [slug]);

      if (result.rows.length === 0) {
        return { post: null };
      }

      const post = result.rows[0];
      
      // Parse JSON fields
      if (post.tags && typeof post.tags === 'string') {
        post.tags = JSON.parse(post.tags);
      }

      return {
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          description: post.description,
          image: post.image,
          publishedAt: post.published_at ? new Date(post.published_at).toISOString() : undefined,
          updatedAt: new Date(post.updated_at).toISOString(),
          author: post.author_name ? {
            name: post.author_name
          } : undefined,
          tags: post.tags || []
        }
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return { post: null };
    }
  }

  async getPosts(options: GetPostsOptions = {}): Promise<GetPostsResult> {
    try {
      const {
        limit = 10,
        tags = [],
        exclude = [],
        status = 'published'
      } = options;

      const queryParams: any[] = [];
      let paramCount = 1;
      let whereClause = 'WHERE 1=1';

      if (status === 'published') {
        whereClause += ` AND p.status = 'published' AND p.published_at IS NOT NULL`;
      }

      if (exclude.length > 0) {
        whereClause += ` AND p.id NOT IN (${exclude.map(() => `$${paramCount++}`).join(',')})`;
        queryParams.push(...exclude);
      }

      if (tags.length > 0) {
        whereClause += ` AND EXISTS (
          SELECT 1 FROM blog_post_tags pt
          JOIN blog_tags t ON pt.tag_id = t.id
          WHERE pt.post_id = p.id AND t.slug = ANY($${paramCount})
        )`;
        queryParams.push(tags);
        paramCount++;
      }

      const result = await query(`
        SELECT 
          p.*,
          u.name as author_name,
          json_agg(json_build_object(
            'id', t.id,
            'name', t.name,
            'slug', t.slug
          )) FILTER (WHERE t.id IS NOT NULL) as tags
        FROM blog_posts p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
        LEFT JOIN blog_tags t ON pt.tag_id = t.id
        ${whereClause}
        GROUP BY p.id, u.name
        ORDER BY p.published_at DESC
        LIMIT $${paramCount}
      `, [...queryParams, limit]);

      const posts = result.rows.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        description: post.description,
        image: post.image,
        publishedAt: post.published_at ? new Date(post.published_at).toISOString() : undefined,
        updatedAt: new Date(post.updated_at).toISOString(),
        author: post.author_name ? {
          name: post.author_name
        } : undefined,
        tags: post.tags || []
      }));

      // Get total count
      const countResult = await query(`
        SELECT COUNT(*) as total
        FROM blog_posts p
        ${whereClause}
      `, queryParams);

      return {
        posts,
        total: parseInt(countResult.rows[0].total)
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return { posts: [], total: 0 };
    }
  }
}

export const wisp = new WispService(); 