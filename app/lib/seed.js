import { query } from './db.js';

async function seedDatabase() {
  try {
    // Insert sample categories
    await query(`
      INSERT INTO categories (name, slug, description)
      VALUES 
        ('Beaches', 'beaches', 'Beautiful Australian beaches and coastal destinations'),
        ('Outback', 'outback', 'Adventures in the Australian outback'),
        ('Cities', 'cities', 'Exploring Australian cities and urban life')
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Insert sample posts
    await query(`
      INSERT INTO posts (title, slug, content, excerpt, featured_image, author, published_at)
      VALUES 
        ('Exploring the Great Barrier Reef', 'great-barrier-reef', 
         'The Great Barrier Reef is one of the world''s most spectacular natural wonders...',
         'Discover the beauty and diversity of the Great Barrier Reef...',
         'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
         'John Smith',
         NOW()),
        ('Adventures in the Outback', 'outback-adventures',
         'The Australian outback offers unique experiences and breathtaking landscapes...',
         'Experience the magic of the Australian outback...',
         'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
         'Jane Doe',
         NOW()),
        ('Sydney Harbour: A Complete Guide', 'sydney-harbour-guide',
         'Sydney Harbour is one of the most beautiful natural harbours in the world...',
         'Your complete guide to exploring Sydney Harbour...',
         'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
         'Mike Johnson',
         NOW())
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Insert sample tags
    await query(`
      INSERT INTO tags (name, slug)
      VALUES 
        ('Nature', 'nature'),
        ('Adventure', 'adventure'),
        ('Culture', 'culture'),
        ('Food', 'food')
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Associate posts with categories
    await query(`
      INSERT INTO post_categories (post_id, category_id)
      SELECT p.id, c.id
      FROM posts p, categories c
      WHERE p.slug = 'great-barrier-reef' AND c.slug = 'beaches'
      ON CONFLICT DO NOTHING;
    `);

    // Associate posts with tags
    await query(`
      INSERT INTO post_tags (post_id, tag_id)
      SELECT p.id, t.id
      FROM posts p, tags t
      WHERE p.slug = 'great-barrier-reef' AND t.slug = 'nature'
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export { seedDatabase }; 