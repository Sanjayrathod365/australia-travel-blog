import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '../../../../lib/db';
import slugify from 'slugify';

// GET /api/admin/tags/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    const tagId = parseInt(params.id, 10);
    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 });
    }

    const result = await query(
      'SELECT * FROM tags WHERE id = $1',
      [tagId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tags/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    const tagId = parseInt(params.id, 10);
    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await query(
      'SELECT * FROM tags WHERE id = $1',
      [tagId]
    );

    if (existingTag.rows.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Check if slug is already taken by another tag
    const slugCheck = await query(
      'SELECT * FROM tags WHERE slug = $1 AND id != $2',
      [slug, tagId]
    );

    if (slugCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Slug is already taken' },
        { status: 400 }
      );
    }

    const result = await query(
      'UPDATE tags SET name = $1, slug = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [name, slug, tagId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tags/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    const tagId = parseInt(params.id, 10);
    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 });
    }

    // Check if tag exists
    const existingTag = await query(
      'SELECT * FROM tags WHERE id = $1',
      [tagId]
    );

    if (existingTag.rows.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Delete tag associations first
    await query('DELETE FROM post_tags WHERE tag_id = $1', [tagId]);

    // Then delete the tag
    await query('DELETE FROM tags WHERE id = $1', [tagId]);

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
} 