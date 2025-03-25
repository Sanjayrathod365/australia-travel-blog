import { query } from '@/app/lib/db';
import Image from 'next/image';
import Link from 'next/link';

async function getPost(slug) {
  try {
    const result = await query(
      `SELECT p.*, 
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
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="mb-4">The post you're looking for doesn't exist.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="mb-6">
          <Image
            src={post.featured_image}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg"
          />
        </div>

        <div className="mb-6 text-gray-600">
          <p>By {post.author}</p>
          <p>Published on {new Date(post.published_at).toLocaleDateString()}</p>
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Categories:</h2>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tags:</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag.toLowerCase()}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-xl mb-8">{post.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
} 