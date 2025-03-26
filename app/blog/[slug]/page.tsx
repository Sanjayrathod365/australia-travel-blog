import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/BlogPostContent";
import { config } from "@/config";
import SocialShareButtons from "@/components/SocialShareButtons";
import FavoriteButton from "@/components/FavoriteButton";
import { listDirectoryListings } from "@/app/lib/directoryDb";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturedBadge from "@/components/FeaturedBadge";
import { logger } from "@/lib/logger";
import ClientCommentSection from "@/components/ClientCommentSection";
import { query } from '@/app/lib/db';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const result = await query(
      `SELECT p.*, u.name as author_name 
       FROM posts p 
       LEFT JOIN users u ON p.author_id = u.id 
       WHERE p.slug = $1 AND p.status = 'published'`,
      [slug]
    );
    
    if (!result.rows.length) {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found."
      };
    }
    
    const post = result.rows[0];
    const title = `${post.title} | ${config.blog.name}`;
    const description = post.description || `Read about ${post.title} on our Australia Travel Blog`;
    const url = `${config.baseUrl}/blog/${slug}`;
    const ogImage = post.image || `${config.baseUrl}/og-image.jpg`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        siteName: config.blog.name,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    logger.error('Error generating metadata for blog post', error as Error);
    return {
      title: "Blog Post",
      description: "Read our latest travel guides and tips for Australia",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const { slug } = await params;
    const result = await query(
      `SELECT p.*, u.name as author_name 
       FROM posts p 
       LEFT JOIN users u ON p.author_id = u.id 
       WHERE p.slug = $1 AND p.status = 'published'`,
      [slug]
    );
    
    if (!result.rows.length) {
      notFound();
    }
    
    const post = result.rows[0];
    
    // Fetch related posts by category or tag
    const relatedResult = await query(
      `SELECT p.*, u.name as author_name 
       FROM posts p 
       LEFT JOIN users u ON p.author_id = u.id 
       WHERE p.status = 'published' 
       AND p.id != $1 
       ORDER BY p.published_at DESC 
       LIMIT 3`,
      [post.id]
    );
    
    const relatedPosts = relatedResult.rows || [];
    
    // Fetch directory listings that might be related to this post
    // This could be based on location or keyword matching
    const locationMatch = post.content?.match(/\b(Sydney|Melbourne|Brisbane|Perth|Adelaide|Gold Coast|Cairns)\b/i);
    const location = locationMatch?.[0];
    
    let relatedListings = [];
    try {
      const relatedListingsData = await listDirectoryListings({
        limit: 3,
        location: location || undefined,
        featured: true,
      });
      relatedListings = relatedListingsData.listings || [];
    } catch (error) {
      // If directory listings fail, just continue without them
      console.error('Error fetching related listings:', error);
    }
    
    // Prepare URL for sharing
    const pageUrl = `${config.baseUrl}/blog/${slug}`;
    
    // Create structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description || `Read about ${post.title} on our Australia Travel Blog`,
      "image": post.image ? [post.image] : [],
      "datePublished": post.published_at,
      "dateModified": post.updated_at,
      "author": {
        "@type": "Person",
        "name": post.author_name || "Australia Travel Blog Editor"
      },
      "publisher": {
        "@type": "Organization",
        "name": config.blog.name,
        "logo": {
          "@type": "ImageObject",
          "url": `${config.baseUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl
      }
    };
    
    return (
      <>
        {/* Add the structured data script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="container mx-auto px-5 mb-12">
          <div className="flex justify-end items-center space-x-2 mb-4">
            <FavoriteButton listingId={post.id} showText={true} />
            <SocialShareButtons 
              url={pageUrl}
              title={post.title}
              description={post.description || post.title}
            />
          </div>
          
          <BlogPostContent post={post} />
          
          {/* Comments Section */}
          {post.comments_enabled && (
            <ClientCommentSection postId={post.id} postSlug={post.slug} />
          )}
          
          {/* Related Section */}
          <div className="mt-12 border-t pt-10">
            {/* Related Listings */}
            {relatedListings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Related Travel Directory Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedListings.map((listing) => (
                    <Link 
                      key={listing.id} 
                      href={`/directory/${listing.category_slug}/${listing.slug}`}
                      className="block bg-white rounded-lg shadow overflow-hidden transition-shadow hover:shadow-md dark:bg-gray-800"
                    >
                      {listing.images && listing.images.length > 0 && (
                        <div className="relative h-48" style={{ position: 'relative' }}>
                          <Image
                            src={listing.images[0]}
                            alt={listing.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          />
                          {listing.featured && (
                            <div className="absolute top-2 right-2">
                              <FeaturedBadge size="sm" />
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors line-clamp-2 dark:text-white">
                          {listing.name}
                        </h3>
                        {listing.city && (
                          <p className="text-gray-600 mb-2 text-sm flex items-center dark:text-gray-300">
                            <MapPin size={14} className="mr-1" /> {listing.city}
                          </p>
                        )}
                        <span className="text-blue-600 text-sm flex items-center hover:underline">
                          View Details <ArrowRight size={14} className="ml-1" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block bg-white rounded-lg shadow overflow-hidden transition-shadow hover:shadow-md dark:bg-gray-800"
                    >
                      {relatedPost.image && (
                        <div className="relative h-48">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors line-clamp-2 dark:text-white">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2 dark:text-gray-300">
                          {relatedPost.description}
                        </p>
                        <span className="text-blue-600 text-sm flex items-center hover:underline">
                          Read More <ArrowRight size={14} className="ml-1" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    logger.error('Error rendering blog post page', error as Error);
    notFound();
  }
}
