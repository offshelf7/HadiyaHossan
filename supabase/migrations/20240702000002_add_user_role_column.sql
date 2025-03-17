-- Add user_role column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'user_role') THEN
    ALTER TABLE users ADD COLUMN user_role TEXT DEFAULT 'user';
  END IF;
END $$;
