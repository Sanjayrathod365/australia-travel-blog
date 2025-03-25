'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  postId: number
  onDelete?: () => void
}

export default function DeleteButton({ postId, onDelete }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      if (onDelete) {
        onDelete()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
} 