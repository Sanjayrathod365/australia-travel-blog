import { Metadata } from 'next'
import Link from 'next/link'
import DeleteButton from '../components/DeleteButton'

export const metadata: Metadata = {
  title: 'Manage Posts | Admin Dashboard',
  description: 'Manage your blog posts in the admin dashboard.',
}

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post: any) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.excerpt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {post.categories?.join(', ') || 'No categories'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {post.tags?.join(', ') || 'No tags'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.published_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <DeleteButton postId={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 