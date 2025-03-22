-- Seed products across different categories with minimum 10 quantity each

-- Jerseys
INSERT INTO products (id, name, description, price, image, category, sizes, colors, in_stock)
VALUES
  (gen_random_uuid(), 'Home Jersey 2024/25', 'Official home jersey for the 2024/25 season', 89.99, 'https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80', 'jerseys', '["S", "M", "L", "XL", "XXL"]'::jsonb, '["Red", "White"]'::jsonb, true),
  (gen_random_uuid(), 'Away Jersey 2024/25', 'Official away jersey for the 2024/25 season', 89.99, 'https://images.unsplash.com/photo-1571537644077-5451c3a28abb?w=800&q=80', 'jerseys', '["S", "M", "L", "XL", "XXL"]'::jsonb, '["Blue", "Black"]'::jsonb, true),
  (gen_random_uuid(), 'Third Kit 2024/25', 'Official third kit for the 2024/25 season', 94.99, 'https://images.unsplash.com/photo-1565377025535-c897f5f71133?w=800&q=80', 'jerseys', '["S", "M", "L", "XL"]'::jsonb, '["Green", "Gold"]'::jsonb, true),
  (gen_random_uuid(), 'Goalkeeper Jersey 2024/25', 'Official goalkeeper jersey for the 2024/25 season', 99.99, 'https://images.unsplash.com/photo-1594476664296-8c552d551161?w=800&q=80', 'jerseys', '["M", "L", "XL", "XXL"]'::jsonb, '["Black", "Yellow"]'::jsonb, true);

-- Update inventory count for jerseys
UPDATE products SET inventory_count = 25 WHERE name = 'Home Jersey 2024/25';
UPDATE products SET inventory_count = 20 WHERE name = 'Away Jersey 2024/25';
UPDATE products SET inventory_count = 15 WHERE name = 'Third Kit 2024/25';
UPDATE products SET inventory_count = 10 WHERE name = 'Goalkeeper Jersey 2024/25';

-- Shoes
INSERT INTO products (id, name, description, price, image, category, sizes, in_stock)
VALUES
  (gen_random_uuid(), 'Elite Pro Cleats', 'Professional grade football cleats for optimal performance', 129.99, 'https://images.unsplash.com/photo-1593032580308-d4bafafc4f28?w=800&q=80', 'shoes', '["7", "8", "9", "10", "11", "12"]'::jsonb, true),
  (gen_random_uuid(), 'Indoor Football Shoes', 'Specialized shoes for indoor football with non-marking soles', 89.99, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', 'shoes', '["7", "8", "9", "10", "11", "12"]'::jsonb, true),
  (gen_random_uuid(), 'Training Shoes', 'Comfortable shoes for training sessions and casual wear', 69.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'shoes', '["7", "8", "9", "10", "11", "12"]'::jsonb, true);

-- Update inventory count for shoes
UPDATE products SET inventory_count = 15 WHERE name = 'Elite Pro Cleats';
UPDATE products SET inventory_count = 18 WHERE name = 'Indoor Football Shoes';
UPDATE products SET inventory_count = 22 WHERE name = 'Training Shoes';

-- Shorts
INSERT INTO products (id, name, description, price, image, category, sizes, colors, in_stock)
VALUES
  (gen_random_uuid(), 'Home Shorts 2024/25', 'Official home shorts for the 2024/25 season', 39.99, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80', 'shorts', '["S", "M", "L", "XL"]'::jsonb, '["Red", "White"]'::jsonb, true),
  (gen_random_uuid(), 'Away Shorts 2024/25', 'Official away shorts for the 2024/25 season', 39.99, 'https://images.unsplash.com/photo-1562886877-3a0d4944103e?w=800&q=80', 'shorts', '["S", "M", "L", "XL"]'::jsonb, '["Blue", "Black"]'::jsonb, true),
  (gen_random_uuid(), 'Training Shorts', 'Lightweight shorts for training sessions', 29.99, 'https://images.unsplash.com/photo-1571078580234-327eda3b2fc0?w=800&q=80', 'shorts', '["S", "M", "L", "XL"]'::jsonb, '["Black", "Gray"]'::jsonb, true);

-- Update inventory count for shorts
UPDATE products SET inventory_count = 30 WHERE name = 'Home Shorts 2024/25';
UPDATE products SET inventory_count = 25 WHERE name = 'Away Shorts 2024/25';
UPDATE products SET inventory_count = 35 WHERE name = 'Training Shorts';

-- Tickets
INSERT INTO products (id, name, description, price, image, category, in_stock)
VALUES
  (gen_random_uuid(), 'Home Match Ticket - Standard', 'Standard ticket for upcoming home match', 25.00, 'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=800&q=80', 'tickets', true),
  (gen_random_uuid(), 'Home Match Ticket - Premium', 'Premium seating for upcoming home match', 45.00, 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=800&q=80', 'tickets', true),
  (gen_random_uuid(), 'Season Ticket - Standard', 'Standard season ticket for all home matches', 450.00, 'https://images.unsplash.com/photo-1610844886739-1156c5ca9bed?w=800&q=80', 'tickets', true),
  (gen_random_uuid(), 'Season Ticket - VIP', 'VIP season ticket with exclusive benefits', 850.00, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', 'tickets', true);

-- Update inventory count for tickets
UPDATE products SET inventory_count = 200 WHERE name = 'Home Match Ticket - Standard';
UPDATE products SET inventory_count = 100 WHERE name = 'Home Match Ticket - Premium';
UPDATE products SET inventory_count = 50 WHERE name = 'Season Ticket - Standard';
UPDATE products SET inventory_count = 20 WHERE name = 'Season Ticket - VIP';

-- Accessories
INSERT INTO products (id, name, description, price, image, category, in_stock)
VALUES
  (gen_random_uuid(), 'Club Scarf', 'Official club scarf in team colors', 19.99, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80', 'accessories', true),
  (gen_random_uuid(), 'Training Socks', 'Professional grade training socks', 12.99, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80', 'accessories', true),
  (gen_random_uuid(), 'Club Cap', 'Adjustable cap with embroidered club logo', 24.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80', 'accessories', true),
  (gen_random_uuid(), 'Water Bottle', 'Club branded water bottle', 14.99, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80', 'accessories', true),
  (gen_random_uuid(), 'Gym Bag', 'Spacious gym bag with club logo', 34.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'accessories', true);

-- Update inventory count for accessories
UPDATE products SET inventory_count = 40 WHERE name = 'Club Scarf';
UPDATE products SET inventory_count = 50 WHERE name = 'Training Socks';
UPDATE products SET inventory_count = 35 WHERE name = 'Club Cap';
UPDATE products SET inventory_count = 45 WHERE name = 'Water Bottle';
UPDATE products SET inventory_count = 30 WHERE name = 'Gym Bag';

-- Equipment
INSERT INTO products (id, name, description, price, image, category, in_stock)
VALUES
  (gen_random_uuid(), 'Training Football', 'Official size training football', 29.99, 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&q=80', 'equipment', true),
  (gen_random_uuid(), 'Match Football', 'Professional match football', 49.99, 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=800&q=80', 'equipment', true),
  (gen_random_uuid(), 'Training Cones (Set of 10)', 'Set of 10 training cones for drills', 19.99, 'https://images.unsplash.com/photo-1587385789097-0197a7fbd179?w=800&q=80', 'equipment', true),
  (gen_random_uuid(), 'Goalkeeper Gloves', 'Professional goalkeeper gloves', 39.99, 'https://images.unsplash.com/photo-1553108715-308e8537ce55?w=800&q=80', 'equipment', true),
  (gen_random_uuid(), 'Training Bibs (Set of 5)', 'Set of 5 training bibs in team colors', 24.99, 'https://images.unsplash.com/photo-1580087255783-17eedfd6fc5a?w=800&q=80', 'equipment', true);

-- Update inventory count for equipment
UPDATE products SET inventory_count = 40 WHERE name = 'Training Football';
UPDATE products SET inventory_count = 25 WHERE name = 'Match Football';
UPDATE products SET inventory_count = 30 WHERE name = 'Training Cones (Set of 10)';
UPDATE products SET inventory_count = 20 WHERE name = 'Goalkeeper Gloves';
UPDATE products SET inventory_count = 25 WHERE name = 'Training Bibs (Set of 5)';

-- Other Items
INSERT INTO products (id, name, description, price, image, category, in_stock)
VALUES
  (gen_random_uuid(), 'Club Mug', 'Ceramic mug with club logo', 12.99, 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80', 'other', true),
  (gen_random_uuid(), 'Phone Case', 'Club branded phone case', 19.99, 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80', 'other', true),
  (gen_random_uuid(), 'Wall Calendar 2024/25', 'Official club calendar featuring player photos', 14.99, 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&q=80', 'other', true),
  (gen_random_uuid(), 'Poster Set', 'Set of 3 player posters', 24.99, 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80', 'other', true),
  (gen_random_uuid(), 'Keychain', 'Metal keychain with club emblem', 9.99, 'https://images.unsplash.com/photo-1622660676447-cdcf42c2a9e8?w=800&q=80', 'other', true);

-- Update inventory count for other items
UPDATE products SET inventory_count = 50 WHERE name = 'Club Mug';
UPDATE products SET inventory_count = 40 WHERE name = 'Phone Case';
UPDATE products SET inventory_count = 30 WHERE name = 'Wall Calendar 2024/25';
UPDATE products SET inventory_count = 25 WHERE name = 'Poster Set';
UPDATE products SET inventory_count = 60 WHERE name = 'Keychain';
