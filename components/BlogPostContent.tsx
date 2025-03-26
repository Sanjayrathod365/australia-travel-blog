"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { MessageSquare, MessageSquareOff } from "lucide-react";
import { useState } from "react";

interface BlogPostContentProps {
  post: {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    published_at: string | Date;
    author_name?: string;
    comments_enabled?: boolean;
    tags?: Array<{
      id: number;
      name: string;
    }>;
  };
}

export const BlogPostContent = ({ post }: BlogPostContentProps) => {
  const [commentsEnabled, setCommentsEnabled] = useState(post.comments_enabled ?? true);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl text-center py-10">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground">
          The blog post you're looking for could not be found.
        </p>
      </div>
    );
  }

  const toggleComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/toggle-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !commentsEnabled }),
      });

      if (response.ok) {
        setCommentsEnabled(!commentsEnabled);
      }
    } catch (error) {
      console.error('Error toggling comments:', error);
    }
  };

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleComments}
            className="flex items-center gap-2"
          >
            {commentsEnabled ? (
              <>
                <MessageSquare className="h-4 w-4" />
                Comments Enabled
              </>
            ) : (
              <>
                <MessageSquareOff className="h-4 w-4" />
                Comments Disabled
              </>
            )}
          </Button>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.id}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        {post.published_at && (
          <p className="text-muted-foreground">
            Published on{" "}
            <time dateTime={post.published_at instanceof Date ? post.published_at.toISOString() : String(post.published_at)}>
              {formatDate(post.published_at instanceof Date ? post.published_at.toISOString() : String(post.published_at))}
            </time>
            {post.author_name && ` by ${post.author_name}`}
          </p>
        )}
      </div>

      {post.image && (
        <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {post.comments_enabled && commentsEnabled && (
        <div className="mt-8">
          {/* Add your comments component here */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {/* Comments will be rendered here */}
          </div>
        </div>
      )}
    </article>
  );
};
