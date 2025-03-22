-- Add inventory_count column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS inventory_count INTEGER DEFAULT 0;
