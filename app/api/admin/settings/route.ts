import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM settings
      WHERE id = 1
    `);

    if (result.rows.length === 0) {
      // Create default settings if none exist
      await query(`
        INSERT INTO settings (
          site_name,
          site_description,
          contact_email,
          social_links
        ) VALUES (
          'Australia Travel Blog',
          'Your guide to exploring Australia',
          'contact@example.com',
          '{}'
        )
      `);

      return NextResponse.json({
        siteName: 'Australia Travel Blog',
        siteDescription: 'Your guide to exploring Australia',
        contactEmail: 'contact@example.com',
        socialLinks: {}
      });
    }

    const settings = result.rows[0];
    return NextResponse.json({
      siteName: settings.site_name,
      siteDescription: settings.site_description,
      contactEmail: settings.contact_email,
      socialLinks: settings.social_links
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { siteName, siteDescription, contactEmail, socialLinks } = body;

    const result = await query(
      `
      UPDATE settings
      SET 
        site_name = $1,
        site_description = $2,
        contact_email = $3,
        social_links = $4,
        updated_at = NOW()
      WHERE id = 1
      RETURNING *
      `,
      [siteName, siteDescription, contactEmail, socialLinks]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    const settings = result.rows[0];
    return NextResponse.json({
      siteName: settings.site_name,
      siteDescription: settings.site_description,
      contactEmail: settings.contact_email,
      socialLinks: settings.social_links
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 