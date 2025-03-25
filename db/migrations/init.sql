-- Create directory categories table
CREATE TABLE IF NOT EXISTS directory_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create directory listings table
CREATE TABLE IF NOT EXISTS directory_listings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES directory_categories(id),
    description TEXT,
    location VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(100),
    price_range VARCHAR(50),
    hours JSONB,
    images JSONB,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_directory_listings_slug ON directory_listings(slug);
CREATE INDEX IF NOT EXISTS idx_directory_listings_category_id ON directory_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_directory_listings_featured ON directory_listings(featured);
CREATE INDEX IF NOT EXISTS idx_directory_categories_slug ON directory_categories(slug);

-- Insert initial categories
INSERT INTO directory_categories (name, slug, description)
VALUES 
    ('Hotels', 'hotels', 'Places to stay during your visit'),
    ('Restaurants', 'restaurants', 'Places to eat and drink'),
    ('Attractions', 'attractions', 'Tourist attractions and points of interest'),
    ('Activities', 'activities', 'Things to do and experiences')
ON CONFLICT (slug) DO NOTHING; 