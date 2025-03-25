import { query } from '@/app/lib/db';
import Link from 'next/link';
import Image from 'next/image';

async function getBlogPosts(destination) {
  try {
    let sql = `
      SELECT p.*, 
        COALESCE(array_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), ARRAY[]::text[]) as categories,
        COALESCE(array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), ARRAY[]::text[]) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
    `;

    const params = [];
    if (destination) {
      sql += ` WHERE LOWER(p.title) LIKE LOWER($1) OR LOWER(p.content) LIKE LOWER($1)`;
      params.push(`%${destination}%`);
    }

    sql += ` GROUP BY p.id ORDER BY p.published_at DESC`;

    const result = await query(sql, params);
    return result.rows.map(post => ({
      ...post,
      categories: Array.isArray(post.categories) ? post.categories.filter(Boolean) : [],
      tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : []
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage({ searchParams }) {
  const destination = searchParams.destination;
  const posts = await getBlogPosts(destination);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {destination ? `Posts about ${destination}` : 'All Blog Posts'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {post.featured_image && (
              <div className="relative h-48">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                  <span key={`${post.id}-cat-${index}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {category}
                  </span>
                ))}
                {post.tags.map((tag, index) => (
                  <span key={`${post.id}-tag-${index}`} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            {destination 
              ? `No posts found for "${destination}". Try a different search term.`
              : 'No blog posts found.'}
          </p>
          <Link href="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
            View all posts
          </Link>
        </div>
      )}
    </div>
  );
} 