import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { query } from '../app/lib/db.js';

// Set up environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: new URL('../.env.local', import.meta.url) });

// Log the database URL (without password) for debugging
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  const maskedUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
  console.log('Using database URL:', maskedUrl);
} else {
  console.error('DATABASE_URL is not set in environment variables');
  process.exit(1);
}

async function seedDatabase() {
  try {
    // Insert sample categories
    await query(`
      INSERT INTO categories (name, slug, description)
      VALUES 
        ('Beaches', 'beaches', 'Beautiful Australian beaches and coastal destinations'),
        ('Outback', 'outback', 'Adventures in the Australian outback'),
        ('Cities', 'cities', 'Exploring Australian cities and urban life'),
        ('Nature', 'nature', 'Natural wonders and wildlife experiences'),
        ('Food & Culture', 'food-culture', 'Australian cuisine and cultural experiences')
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Insert sample posts
    await query(`
      INSERT INTO posts (title, slug, content, excerpt, featured_image, author, published_at)
      VALUES 
        ('Exploring the Great Barrier Reef', 'great-barrier-reef', 
         'The Great Barrier Reef is one of the world''s most spectacular natural wonders. Stretching over 2,300 kilometers along the Queensland coast, this UNESCO World Heritage site is home to an incredible diversity of marine life. From colorful coral formations to majestic sea turtles and playful dolphins, every dive or snorkel session reveals new wonders. The reef''s crystal-clear waters and vibrant ecosystem make it a paradise for both experienced divers and beginners. Whether you''re exploring the outer reef or the sheltered lagoons, the Great Barrier Reef offers unforgettable experiences for nature lovers and adventure seekers alike.',
         'Discover the beauty and diversity of the Great Barrier Reef, one of the world''s most spectacular natural wonders.',
         'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
         'John Smith',
         NOW()),
        ('Adventures in the Outback', 'outback-adventures',
         'The Australian outback offers unique experiences and breathtaking landscapes that will leave you in awe. From the iconic red sands of Uluru to the vast expanses of the Northern Territory, the outback is a place where ancient traditions meet modern adventure. Experience the magic of stargazing under crystal-clear skies, discover ancient Aboriginal rock art, and witness the stunning sunsets that paint the landscape in brilliant colors. The outback''s rugged beauty and rich cultural heritage make it an essential destination for any traveler seeking authentic Australian experiences.',
         'Experience the magic of the Australian outback, from Uluru to the Northern Territory.',
         'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
         'Jane Doe',
         NOW()),
        ('Sydney Harbour: A Complete Guide', 'sydney-harbour-guide',
         'Sydney Harbour is one of the most beautiful natural harbours in the world, offering a perfect blend of urban sophistication and natural beauty. From the iconic Sydney Opera House to the historic Harbour Bridge, the harbour is surrounded by world-famous landmarks. Take a ferry ride to explore the various bays and beaches, or enjoy a leisurely walk along the waterfront promenades. The harbour''s waters are perfect for sailing, kayaking, and swimming, while its shores are dotted with excellent restaurants and cafes. Whether you''re visiting for the first time or returning to this stunning city, Sydney Harbour never fails to impress.',
         'Your complete guide to exploring Sydney Harbour, from iconic landmarks to hidden gems.',
         'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
         'Mike Johnson',
         NOW()),
        ('Melbourne''s Hidden Laneways', 'melbourne-laneways',
         'Melbourne''s laneways are a testament to the city''s creative spirit and cultural diversity. These narrow alleys are transformed into vibrant spaces filled with street art, boutique shops, and cozy cafes. From the famous Hosier Lane to the lesser-known Degraves Street, each laneway tells its own story through art, architecture, and atmosphere. Discover hidden bars, unique fashion boutiques, and some of the city''s best coffee spots. The laneways are not just thoroughfares but living, breathing spaces that showcase Melbourne''s artistic and culinary excellence.',
         'Explore Melbourne''s famous laneways, where art, culture, and cuisine come together.',
         'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
         'Sarah Wilson',
         NOW()),
        ('Tasmanian Wilderness Adventures', 'tasmanian-wilderness',
         'Tasmania''s wilderness areas offer some of Australia''s most pristine and breathtaking natural landscapes. From the rugged peaks of Cradle Mountain to the ancient forests of the Tarkine, Tasmania is a paradise for nature lovers and hikers. The island''s unique flora and fauna, including the famous Tasmanian devil, make it a fascinating destination for wildlife enthusiasts. Whether you''re trekking through national parks, exploring coastal trails, or visiting historic sites, Tasmania''s natural beauty and rich heritage will leave you spellbound.',
         'Discover the natural wonders of Tasmania, from Cradle Mountain to the Tarkine wilderness.',
         'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
         'David Brown',
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
        ('Food', 'food'),
        ('Wildlife', 'wildlife'),
        ('Hiking', 'hiking'),
        ('Beach', 'beach'),
        ('City Life', 'city-life')
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Associate posts with categories
    await query(`
      INSERT INTO post_categories (post_id, category_id)
      SELECT p.id, c.id
      FROM posts p, categories c
      WHERE (p.slug = 'great-barrier-reef' AND c.slug = 'beaches')
      OR (p.slug = 'great-barrier-reef' AND c.slug = 'nature')
      OR (p.slug = 'outback-adventures' AND c.slug = 'outback')
      OR (p.slug = 'sydney-harbour-guide' AND c.slug = 'cities')
      OR (p.slug = 'melbourne-laneways' AND c.slug = 'cities')
      OR (p.slug = 'melbourne-laneways' AND c.slug = 'food-culture')
      OR (p.slug = 'tasmanian-wilderness' AND c.slug = 'nature')
      ON CONFLICT DO NOTHING;
    `);

    // Associate posts with tags
    await query(`
      INSERT INTO post_tags (post_id, tag_id)
      SELECT p.id, t.id
      FROM posts p, tags t
      WHERE (p.slug = 'great-barrier-reef' AND t.slug = 'nature')
      OR (p.slug = 'great-barrier-reef' AND t.slug = 'wildlife')
      OR (p.slug = 'great-barrier-reef' AND t.slug = 'beach')
      OR (p.slug = 'outback-adventures' AND t.slug = 'adventure')
      OR (p.slug = 'outback-adventures' AND t.slug = 'hiking')
      OR (p.slug = 'sydney-harbour-guide' AND t.slug = 'city-life')
      OR (p.slug = 'melbourne-laneways' AND t.slug = 'city-life')
      OR (p.slug = 'melbourne-laneways' AND t.slug = 'culture')
      OR (p.slug = 'melbourne-laneways' AND t.slug = 'food')
      OR (p.slug = 'tasmanian-wilderness' AND t.slug = 'nature')
      OR (p.slug = 'tasmanian-wilderness' AND t.slug = 'hiking')
      OR (p.slug = 'tasmanian-wilderness' AND t.slug = 'wildlife')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  }); 