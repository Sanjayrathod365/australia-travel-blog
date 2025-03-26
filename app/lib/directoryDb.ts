import db from './db';
import { pool } from './db';

// Updated DirectoryListing interface to match database schema
export interface DirectoryListing {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  location_data: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  hours?: {
    [key: string]: string;
  };
  price_range?: string;
  featured?: boolean;
  created_at: Date;
  updated_at: Date;
}

// Directory Category interface
export interface DirectoryCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Update getDirectoryListingBySlug to handle structured location data
export async function getDirectoryListingBySlug(slug: string): Promise<DirectoryListing | null> {
  try {
    const result = await db.query(`
      SELECT 
        d.*,
        c.name as category_name,
        c.slug as category_slug
      FROM directory_listings d
      LEFT JOIN directory_categories c ON d.category_id = c.id
      WHERE d.slug = $1
    `, [slug]);

    if (result.rows.length === 0) {
      return null;
    }

    const listing = result.rows[0];
    
    // Parse JSON fields
    if (listing.images && typeof listing.images === 'string') {
      listing.images = JSON.parse(listing.images);
    }
    
    if (listing.hours && typeof listing.hours === 'string') {
      listing.hours = JSON.parse(listing.hours);
    }
    
    // Handle location data
    if (listing.location_data && typeof listing.location_data === 'string') {
      listing.location_data = JSON.parse(listing.location_data);
    }
    
    return listing;
  } catch (error) {
    console.error('Error fetching directory listing:', error);
    return null;
  }
}

// Update the createDirectoryListing function to save structured location data
export async function createDirectoryListing(data: Partial<DirectoryListing>): Promise<number | null> {
  try {
    // Process location data
    let locationData = data.location_data;
    if (locationData && typeof locationData === 'string') {
      locationData = JSON.parse(locationData);
    }

    // Process images
    let images = data.images;
    if (images && typeof images === 'string') {
      images = JSON.parse(images);
    }

    // Process hours
    let hours = data.hours;
    if (hours && typeof hours === 'string') {
      hours = JSON.parse(hours);
    }

    // Generate slug if not provided
    let slug = data.slug;
    if (!slug && data.name) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    // If slug exists, check for duplicates and add a suffix if needed
    if (slug) {
      const duplicateCheck = await db.query('SELECT slug FROM directory_listings WHERE slug = $1', [slug]);
      if (duplicateCheck.rows.length > 0) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const result = await db.query(`
      INSERT INTO directory_listings (
        name, slug, description, address, city, state, postal_code,
        country, phone, email, website, category_id, location_data,
        images, hours, price_range, featured, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING id
    `, [
      data.name,
      slug,
      data.description,
      data.address,
      data.city,
      data.state,
      data.postal_code,
      data.country,
      data.phone,
      data.email,
      data.website,
      data.category_id,
      JSON.stringify(locationData),
      JSON.stringify(images),
      JSON.stringify(hours),
      data.price_range,
      data.featured
    ]);

    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating directory listing:', error);
    return null;
  }
}

// Update the updateDirectoryListing function for structured location data
export async function updateDirectoryListing(id: number, data: Partial<DirectoryListing>): Promise<boolean> {
  try {
    // Process location data
    let locationData = data.location_data;
    if (locationData && typeof locationData === 'string') {
      locationData = JSON.parse(locationData);
    }

    // Process images
    let images = data.images;
    if (images && typeof images === 'string') {
      images = JSON.parse(images);
    }

    // Process hours
    let hours = data.hours;
    if (hours && typeof hours === 'string') {
      hours = JSON.parse(hours);
    }

    // Check if slug is being changed and verify it doesn't conflict
    if (data.slug) {
      const duplicateCheck = await db.query(
        'SELECT slug FROM directory_listings WHERE slug = $1 AND id != $2', 
        [data.slug, id]
      );
      if (duplicateCheck.rows.length > 0) {
        data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (data.name) {
      updates.push(`name = $${paramCount}`);
      values.push(data.name);
      paramCount++;
    }

    if (data.slug) {
      updates.push(`slug = $${paramCount}`);
      values.push(data.slug);
      paramCount++;
    }

    if (data.description) {
      updates.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }

    if (data.address) {
      updates.push(`address = $${paramCount}`);
      values.push(data.address);
      paramCount++;
    }

    if (data.city) {
      updates.push(`city = $${paramCount}`);
      values.push(data.city);
      paramCount++;
    }

    if (data.state) {
      updates.push(`state = $${paramCount}`);
      values.push(data.state);
      paramCount++;
    }

    if (data.postal_code) {
      updates.push(`postal_code = $${paramCount}`);
      values.push(data.postal_code);
      paramCount++;
    }

    if (data.country) {
      updates.push(`country = $${paramCount}`);
      values.push(data.country);
      paramCount++;
    }

    if (data.phone) {
      updates.push(`phone = $${paramCount}`);
      values.push(data.phone);
      paramCount++;
    }

    if (data.email) {
      updates.push(`email = $${paramCount}`);
      values.push(data.email);
      paramCount++;
    }

    if (data.website) {
      updates.push(`website = $${paramCount}`);
      values.push(data.website);
      paramCount++;
    }

    if (data.category_id) {
      updates.push(`category_id = $${paramCount}`);
      values.push(data.category_id);
      paramCount++;
    }

    if (locationData) {
      updates.push(`location_data = $${paramCount}`);
      values.push(JSON.stringify(locationData));
      paramCount++;
    }

    if (images) {
      updates.push(`images = $${paramCount}`);
      values.push(JSON.stringify(images));
      paramCount++;
    }

    if (hours) {
      updates.push(`hours = $${paramCount}`);
      values.push(JSON.stringify(hours));
      paramCount++;
    }

    if (data.price_range) {
      updates.push(`price_range = $${paramCount}`);
      values.push(data.price_range);
      paramCount++;
    }

    if (data.featured !== undefined) {
      updates.push(`featured = $${paramCount}`);
      values.push(data.featured);
      paramCount++;
    }

    if (updates.length === 0) {
      return true; // Nothing to update
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE directory_listings
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `;

    await db.query(query, values);
    return true;
  } catch (error) {
    console.error('Error updating directory listing:', error);
    return false;
  }
}

// Update the listDirectoryListings function to return structured location data
export async function listDirectoryListings(options: {
  page?: number;
  limit?: number;
  categoryId?: number;
  featured?: boolean;
  location?: string;
  search?: string;
  sort?: string;
}): Promise<{ listings: DirectoryListing[]; total: number; pages: number }> {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
      featured,
      location,
      search,
      sort = 'created_at DESC'
    } = options;

    const offset = (page - 1) * limit;
    const queryParams: any[] = [];
    let query = `
      SELECT 
        d.*,
        c.name as category_name,
        c.slug as category_slug
      FROM directory_listings d
      LEFT JOIN directory_categories c ON d.category_id = c.id
      WHERE 1=1
    `;

    if (categoryId) {
      queryParams.push(categoryId);
      query += ` AND d.category_id = $${queryParams.length}`;
    }

    if (featured) {
      query += ` AND d.featured = true`;
    }

    if (location) {
      queryParams.push(location);
      query += ` AND d.location ILIKE $${queryParams.length}`;
    }

    if (search) {
      queryParams.push(`%${search}%`);
      query += ` AND (d.name ILIKE $${queryParams.length} OR d.description ILIKE $${queryParams.length})`;
    }

    query += ` ORDER BY ${sort}`;
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const result = await db.query(query, queryParams);
    
    // Process results
    const listings = result.rows.map((listing: any) => {
      if (listing.images && typeof listing.images === 'string') {
        listing.images = JSON.parse(listing.images);
      }
      if (listing.hours && typeof listing.hours === 'string') {
        listing.hours = JSON.parse(listing.hours);
      }
      if (listing.location_data && typeof listing.location_data === 'string') {
        listing.location_data = JSON.parse(listing.location_data);
      }
      return listing;
    });

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM directory_listings d
      WHERE 1=1
      ${categoryId ? `AND d.category_id = $1` : ''}
      ${featured ? 'AND d.featured = true' : ''}
      ${location ? `AND d.location ILIKE $${categoryId ? '2' : '1'}` : ''}
      ${search ? `AND (d.name ILIKE $${categoryId && location ? '3' : categoryId || location ? '2' : '1'} OR d.description ILIKE $${categoryId && location ? '3' : categoryId || location ? '2' : '1'})` : ''}
    `;

    const countParams = [];
    if (categoryId) countParams.push(categoryId);
    if (location) countParams.push(location);
    if (search) countParams.push(`%${search}%`);

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    const pages = Math.ceil(total / limit);

    return {
      listings,
      total,
      pages
    };
  } catch (error) {
    console.error('Error listing directory listings:', error);
    return {
      listings: [],
      total: 0,
      pages: 0
    };
  }
}

// Get all directory categories
export async function listDirectoryCategories(): Promise<DirectoryCategory[]> {
  try {
    const query = `
      SELECT * FROM directory_categories
      ORDER BY name ASC
    `;
    
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error listing directory categories:', error);
    return [];
  }
}

// Get directory category by slug
export async function getDirectoryCategoryBySlug(slug: string): Promise<DirectoryCategory | null> {
  try {
    const query = `
      SELECT * FROM directory_categories
      WHERE slug = $1
    `;
    
    const result = await db.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching directory category by slug:', error);
    return null;
  }
}

// Create a new directory category
export async function createDirectoryCategory(
  name: string, 
  slug: string, 
  description?: string
): Promise<DirectoryCategory | null> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check for duplicate slug
    const duplicateCheck = await client.query(
      'SELECT slug FROM directory_categories WHERE slug = $1', 
      [slug]
    );
    
    if (duplicateCheck.rows.length > 0) {
      // Add timestamp to make slug unique
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    
    const query = `
      INSERT INTO directory_categories (name, slug, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [name, slug, description];
    const result = await client.query(query, values);
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating directory category:', error);
    return null;
  } finally {
    client.release();
  }
}
