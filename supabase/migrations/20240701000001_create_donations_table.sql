-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  donor_name TEXT,
  donor_email TEXT,
  anonymous BOOLEAN DEFAULT FALSE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own donations" ON donations;
CREATE POLICY "Users can view their own donations"
  ON donations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all donations" ON donations;
CREATE POLICY "Admins can view all donations"
  ON donations FOR ALL
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public can view non-anonymous donations" ON donations;
CREATE POLICY "Public can view non-anonymous donations"
  ON donations FOR SELECT
  USING (anonymous = FALSE);

-- Add realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'donations'
  ) THEN
    alter publication supabase_realtime add table donations;
  END IF;
END
$$;

-- Create view for top donors
CREATE OR REPLACE VIEW top_donors AS
SELECT 
  user_id,
  donor_name,
  SUM(amount) as total_amount,
  MAX(created_at) as last_donation_date
FROM donations
WHERE payment_status = 'succeeded' AND anonymous = FALSE
GROUP BY user_id, donor_name
ORDER BY total_amount DESC;

-- Create view for weekly top donors
CREATE OR REPLACE VIEW weekly_top_donors AS
SELECT 
  user_id,
  donor_name,
  SUM(amount) as total_amount,
  MAX(created_at) as last_donation_date
FROM donations
WHERE 
  payment_status = 'succeeded' AND 
  anonymous = FALSE AND
  created_at > (CURRENT_DATE - INTERVAL '7 days')
GROUP BY user_id, donor_name
ORDER BY total_amount DESC;