-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  sizes JSONB,
  colors JSONB,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB,
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Simple policies without role checks
DROP POLICY IF EXISTS "Products are editable by authenticated users" ON products;
CREATE POLICY "Products are editable by authenticated users"
  ON products FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Order items policies
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can view order items" ON order_items;
CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create their own order items" ON order_items;
CREATE POLICY "Users can create their own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Enable realtime
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;

-- Insert sample products from the existing products array
INSERT INTO products (id, name, description, price, image, category, sizes, colors, in_stock)
VALUES
  ('tshirt-home', 'Home Jersey 2023/24', 'Official Hadiya Hossana FC home jersey for the 2023/24 season.', 59.99, 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80', 'jerseys', '["S", "M", "L", "XL", "XXL"]', '["Red", "White"]', true),
  ('tshirt-away', 'Away Jersey 2023/24', 'Official Hadiya Hossana FC away jersey for the 2023/24 season.', 59.99, 'https://images.unsplash.com/photo-1580087257330-f4b6627f4e2a?w=800&q=80', 'jerseys', '["S", "M", "L", "XL", "XXL"]', '["Blue", "White"]', true),
  ('shorts-home', 'Home Shorts 2023/24', 'Official Hadiya Hossana FC home shorts for the 2023/24 season.', 29.99, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80', 'shorts', '["S", "M", "L", "XL", "XXL"]', '["Red"]', true),
  ('shoes-training', 'Training Shoes', 'Hadiya Hossana FC branded training shoes with superior comfort and grip.', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'footwear', '["7", "8", "9", "10", "11", "12"]', '["Red/White", "Black/Red"]', true),
  ('scarf-supporter', 'Supporter''s Scarf', 'Show your support with this official Hadiya Hossana FC scarf.', 19.99, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80', 'accessories', '[]', '["Red/White"]', true),
  ('hat-cap', 'Club Cap', 'Stylish Hadiya Hossana FC cap with embroidered logo.', 24.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80', 'accessories', '[]', '["Red", "Black", "White"]', true),
  ('bag-gym', 'Training Gym Bag', 'Spacious gym bag with the Hadiya Hossana FC logo.', 39.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'accessories', '[]', '["Black/Red"]', true),
  ('ball-replica', 'Replica Match Ball', 'Replica of the official match ball used by Hadiya Hossana FC.', 34.99, 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&q=80', 'equipment', '[]', '[]', true)
ON CONFLICT (id) DO NOTHING;
