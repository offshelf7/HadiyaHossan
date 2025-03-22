-- Create payments table to store all payment records
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_intent_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table to store items in an order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to decrement product inventory
CREATE OR REPLACE FUNCTION decrement_inventory(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET inventory = GREATEST(inventory - p_quantity, 0)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for payments table
ALTER PUBLICATION supabase_realtime ADD TABLE payments;

-- Enable realtime for order_items table
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
