import Link from 'next/link';
import { getPost } from '@/app/lib/posts';
import ReactMarkdown from 'react-markdown';

interface Post {
  title: string;
  content: string;
  published_at: string;
  categories: string[];
  tags: string[];
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p>The post you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories
              .filter((category: string | null | undefined): category is string => Boolean(category))
              .map((category: string) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                >
                  {category}
                </Link>
              ))}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags
              .filter((tag: string | null | undefined): tag is string => Boolean(tag))
              .map((tag: string) => (
                <Link
                  key={tag}
                  href={`/tag/${tag.toLowerCase()}`}
                  className="bg-blue-100 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                >
                  {tag}
                </Link>
              ))}
          </div>
        )}

        <div className="text-gray-600 mb-8">
          Published on {new Date(post.published_at).toLocaleDateString()}
        </div>

        <div className="mt-8">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
} 