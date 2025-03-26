import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  try {
    // Fetch stats
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM posts) as total_posts,
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COUNT(*) FROM tags) as total_tags,
        (SELECT COUNT(*) FROM users) as total_users
    `);

    // Fetch recent posts
    const postsResult = await query(`
      SELECT 
        p.id,
        p.title,
        p.published_at,
        u.name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    // Fetch recent activity
    const activityResult = await query(`
      SELECT 
        id,
        name,
        created_at,
        'user' as type
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      stats: {
        totalPosts: parseInt(statsResult.rows[0].total_posts),
        totalCategories: parseInt(statsResult.rows[0].total_categories),
        totalTags: parseInt(statsResult.rows[0].total_tags),
        totalUsers: parseInt(statsResult.rows[0].total_users),
      },
      recentPosts: postsResult.rows,
      recentActivity: activityResult.rows,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 