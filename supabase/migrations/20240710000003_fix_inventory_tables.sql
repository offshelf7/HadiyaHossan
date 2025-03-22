-- Fix the inventory_log table by ensuring product_id is UUID type
DROP TABLE IF EXISTS inventory_log;

CREATE TABLE IF NOT EXISTS inventory_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  previous_count INTEGER NOT NULL,
  new_count INTEGER NOT NULL,
  change_type TEXT NOT NULL, -- 'order', 'restock', 'adjustment'
  reference_id TEXT, -- order_id or other reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Ensure products table has UUID id
ALTER TABLE products
  ALTER COLUMN id TYPE UUID USING id::uuid;

-- Recreate the functions to ensure they work with UUID types
CREATE OR REPLACE FUNCTION check_product_availability(p_product_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_count INTEGER;
BEGIN
  SELECT inventory_count INTO available_count FROM products WHERE id = p_product_id;
  RETURN available_count >= p_quantity;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_inventory(p_product_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Get current inventory count
  SELECT inventory_count INTO current_count FROM products WHERE id = p_product_id;
  
  -- Check if enough inventory
  IF current_count < p_quantity THEN
    RETURN FALSE;
  END IF;
  
  -- Update inventory
  UPDATE products 
  SET 
    inventory_count = inventory_count - p_quantity,
    updated_at = NOW()
  WHERE id = p_product_id;
  
  -- Log the change
  INSERT INTO inventory_log (
    product_id, 
    previous_count, 
    new_count, 
    change_type
  ) VALUES (
    p_product_id,
    current_count,
    current_count - p_quantity,
    'order'
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restock_inventory(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Get current inventory count
  SELECT inventory_count INTO current_count FROM products WHERE id = p_product_id;
  
  -- Update inventory
  UPDATE products 
  SET 
    inventory_count = inventory_count + p_quantity,
    updated_at = NOW()
  WHERE id = p_product_id;
  
  -- Log the change
  INSERT INTO inventory_log (
    product_id, 
    previous_count, 
    new_count, 
    change_type
  ) VALUES (
    p_product_id,
    current_count,
    current_count + p_quantity,
    'restock'
  );
  
END;
$$ LANGUAGE plpgsql;
