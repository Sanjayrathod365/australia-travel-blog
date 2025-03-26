import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.published_at,
        p.status,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) as category,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.status = 'published'
      GROUP BY p.id, c.id, c.name
      ORDER BY p.published_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
} 