-- First, drop the existing foreign key constraint if it exists
ALTER TABLE IF EXISTS order_items
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Make sure products table has UUID type for id
ALTER TABLE IF EXISTS products
  ALTER COLUMN id SET DATA TYPE UUID USING id::uuid;

-- Make sure order_items table has UUID type for product_id
ALTER TABLE IF EXISTS order_items
  ALTER COLUMN product_id SET DATA TYPE UUID USING product_id::uuid;

-- Now recreate the foreign key constraint
ALTER TABLE IF EXISTS order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id);
