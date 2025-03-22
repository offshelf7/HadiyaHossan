-- Fix the order_items table by ensuring product_id is UUID type
ALTER TABLE IF EXISTS order_items
  ALTER COLUMN product_id TYPE UUID USING product_id::uuid;

-- Recreate the foreign key constraint
ALTER TABLE IF EXISTS order_items
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE IF EXISTS order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
