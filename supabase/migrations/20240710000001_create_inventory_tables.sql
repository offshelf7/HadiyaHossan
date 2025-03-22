-- Create product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table with inventory tracking
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  inventory_count INTEGER NOT NULL DEFAULT 0,
  sizes TEXT[] DEFAULT NULL,
  colors TEXT[] DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_log table to track inventory changes
CREATE TABLE IF NOT EXISTS inventory_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  previous_count INTEGER NOT NULL,
  new_count INTEGER NOT NULL,
  change_type TEXT NOT NULL, -- 'order', 'restock', 'adjustment'
  reference_id TEXT, -- order_id or other reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create function to check product availability
CREATE OR REPLACE FUNCTION check_product_availability(p_product_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_count INTEGER;
BEGIN
  SELECT inventory_count INTO available_count FROM products WHERE id = p_product_id;
  RETURN available_count >= p_quantity;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement inventory
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

-- Create function to restock inventory
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

-- Seed product categories
INSERT INTO product_categories (name) VALUES 
('Jersey'),
('Shoes'),
('Shorts'),
('Tickets'),
('Accessories'),
('Equipment')
ON CONFLICT DO NOTHING;

-- Seed products
INSERT INTO products (name, description, price, image, category, inventory_count, sizes, colors) VALUES
-- Jerseys
('Home Jersey 2023/24', 'Official home jersey for the 2023/24 season', 89.99, 'https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80', 'Jersey', 50, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Red', 'White']),
('Away Jersey 2023/24', 'Official away jersey for the 2023/24 season', 89.99, 'https://images.unsplash.com/photo-1571537644077-5f10bcc5c141?w=800&q=80', 'Jersey', 40, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black']),
('Third Kit Jersey 2023/24', 'Official third kit for the 2023/24 season', 94.99, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80', 'Jersey', 30, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Green', 'Gold']),

-- Shoes
('Pro Football Boots', 'Professional grade football boots with studs', 129.99, 'https://images.unsplash.com/photo-1511886929837-354984c0605b?w=800&q=80', 'Shoes', 25, ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'Red']),
('Indoor Football Shoes', 'Shoes designed for indoor football courts', 89.99, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'Shoes', 35, ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['White', 'Blue']),
('Training Shoes', 'Comfortable shoes for training sessions', 69.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Shoes', 40, ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Grey', 'Black']),

-- Shorts
('Home Shorts 2023/24', 'Official home shorts for the 2023/24 season', 39.99, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80', 'Shorts', 60, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Red', 'White']),
('Away Shorts 2023/24', 'Official away shorts for the 2023/24 season', 39.99, 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80', 'Shorts', 55, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black']),
('Training Shorts', 'Comfortable shorts for training sessions', 29.99, 'https://images.unsplash.com/photo-1565115021788-6d3f1ade4980?w=800&q=80', 'Shorts', 70, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Grey']),

-- Tickets
('Home Match Ticket - Standard', 'Standard ticket for upcoming home match', 25.00, 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80', 'Tickets', 1000, NULL, NULL),
('Home Match Ticket - Premium', 'Premium seating for upcoming home match', 45.00, 'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=800&q=80', 'Tickets', 500, NULL, NULL),
('Season Ticket 2023/24', 'Full season ticket for all home matches', 450.00, 'https://images.unsplash.com/photo-1610844886739-1156c5ca82fa?w=800&q=80', 'Tickets', 200, NULL, NULL),

-- Accessories
('Team Scarf', 'Official team scarf in club colors', 19.99, 'https://images.unsplash.com/photo-1520903920243-1d2c1a3a1b4c?w=800&q=80', 'Accessories', 100, NULL, ARRAY['Red/White', 'Blue/Black']),
('Team Beanie Hat', 'Warm beanie hat with team logo', 24.99, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80', 'Accessories', 80, NULL, ARRAY['Red', 'Blue', 'Black']),
('Water Bottle', 'Club branded water bottle', 14.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 'Accessories', 120, NULL, ARRAY['Clear', 'Red', 'Blue']),

-- Equipment
('Training Football', 'Official size training football', 29.99, 'https://images.unsplash.com/photo-1614632537423-5e1c7618270d?w=800&q=80', 'Equipment', 45, ARRAY['Size 5', 'Size 4'], NULL),
('Training Cones (Set of 10)', 'Set of 10 training cones', 19.99, 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=80', 'Equipment', 30, NULL, ARRAY['Orange', 'Yellow']),
('Training Bib Set', 'Set of 10 training bibs', 49.99, 'https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80', 'Equipment', 25, NULL, ARRAY['Red', 'Blue', 'Yellow'])
ON CONFLICT DO NOTHING;

-- Enable row level security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public read access" ON products;
CREATE POLICY "Public read access"
ON products FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admin full access" ON products;
CREATE POLICY "Admin full access"
ON products FOR ALL
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Enable realtime
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table inventory_log;
