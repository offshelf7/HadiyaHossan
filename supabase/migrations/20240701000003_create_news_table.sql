-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public can view published news" ON news;
CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (published = TRUE);

DROP POLICY IF EXISTS "Admins can manage all news" ON news;
CREATE POLICY "Admins can manage all news"
  ON news FOR ALL
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Reporters can manage their own news" ON news;
CREATE POLICY "Reporters can manage their own news"
  ON news FOR ALL
  USING (auth.uid() = author_id);

-- Add realtime
alter publication supabase_realtime add table news;

-- Create commercial content table
CREATE TABLE IF NOT EXISTS commercial_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE commercial_content ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public can view published commercial content" ON commercial_content;
CREATE POLICY "Public can view published commercial content"
  ON commercial_content FOR SELECT
  USING (published = TRUE);

DROP POLICY IF EXISTS "Admins can manage all commercial content" ON commercial_content;
CREATE POLICY "Admins can manage all commercial content"
  ON commercial_content FOR ALL
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Salespeople can manage their own commercial content" ON commercial_content;
CREATE POLICY "Salespeople can manage their own commercial content"
  ON commercial_content FOR ALL
  USING (auth.uid() = author_id);

-- Add realtime
alter publication supabase_realtime add table commercial_content;
