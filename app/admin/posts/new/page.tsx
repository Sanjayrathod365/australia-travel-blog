'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, MessageSquareOff } from 'lucide-react';

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: number | null;
  tags: number[];
  status: 'draft' | 'published';
  comments_enabled: boolean;
}

export default function NewPost() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: null,
    tags: [],
    status: 'draft',
    comments_enabled: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data?.user) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Generate slug from title if not provided
      const postData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error(data.message || data.error || 'Failed to create post');
      }

      router.push('/admin/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleComments = () => {
    setFormData(prev => ({
      ...prev,
      comments_enabled: !prev.comments_enabled
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Create New Post</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            placeholder="Enter post title"
          />
        </div>

        {/* Comments Toggle Button */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-900">Comments</h3>
            <p className="text-sm text-gray-500 mt-1">Allow visitors to leave comments on this post</p>
          </div>
          <button
            type="button"
            onClick={toggleComments}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              formData.comments_enabled
                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {formData.comments_enabled ? (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments Enabled
              </>
            ) : (
              <>
                <MessageSquareOff className="h-4 w-4 mr-2" />
                Comments Disabled
              </>
            )}
          </button>
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-900 mb-1">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            placeholder="enter-post-slug"
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to auto-generate from title
          </p>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900 mb-1">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            placeholder="Brief description of the post"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-1">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={10}
            required
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            placeholder="Write your post content here..."
          />
        </div>

        <div>
          <label htmlFor="featured_image" className="block text-sm font-medium text-gray-900 mb-1">
            Featured Image URL
          </label>
          <input
            type="url"
            name="featured_image"
            id="featured_image"
            value={formData.featured_image}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-1">
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
} 