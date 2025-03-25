'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecentPosts({ posts }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeletingId(postId);
    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-2 py-1.5 text-left font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-2 py-1.5 text-left font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-2 py-1.5 text-right font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-2 py-1.5">
                <div className="font-medium text-gray-900 truncate max-w-[250px]">{post.title}</div>
                <div className="text-[10px] text-gray-500 truncate max-w-[250px]">{post.excerpt}</div>
              </td>
              <td className="px-2 py-1.5 whitespace-nowrap text-[10px] text-gray-500">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-2 py-1.5 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-1">
                  <Link 
                    href={`/admin/posts/${post.id}/edit`}
                    className="inline-flex items-center px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className={`inline-flex items-center px-1.5 py-0.5 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md ${
                      deletingId === post.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 