-- Create a media table for news articles
CREATE TABLE IF NOT EXISTS news_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE news_media ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow select access to all users" ON news_media;
CREATE POLICY "Allow select access to all users"
  ON news_media FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert access to authenticated users" ON news_media;
CREATE POLICY "Allow insert access to authenticated users"
  ON news_media FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow update access to admins and reporters" ON news_media;
CREATE POLICY "Allow update access to admins and reporters"
  ON news_media FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.user_role = 'admin' OR users.user_role = 'reporter')
    )
  );

DROP POLICY IF EXISTS "Allow delete access to admins and reporters" ON news_media;
CREATE POLICY "Allow delete access to admins and reporters"
  ON news_media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.user_role = 'admin' OR users.user_role = 'reporter')
    )
  );

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE news_media;
