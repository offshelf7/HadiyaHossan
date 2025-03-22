-- Add inventory_count column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS inventory_count INTEGER DEFAULT 0;

-- Enable realtime for products table
alter publication supabase_realtime add table products;
