-- NCA Store - Seed Data

-- Categories
INSERT INTO categories (name, slug, image_url, sort_order) VALUES
  ('Amigurumi', 'amigurumi', '/images/categories/amigurumi.jpg', 1),
  ('Wearables', 'wearables', '/images/categories/wearables.jpg', 2),
  ('Bags & Totes', 'bags-totes', '/images/categories/bags.jpg', 3),
  ('Home Decor', 'home-decor', '/images/categories/home-decor.jpg', 4),
  ('Baby & Kids', 'baby-kids', '/images/categories/baby-kids.jpg', 5),
  ('Seasonal', 'seasonal', '/images/categories/seasonal.jpg', 6);

-- Sample Products
INSERT INTO products (title, slug, description, whats_included, materials, size_info, price, sale_price, category_id, skill_level, pages_count, images, tags, is_featured, is_bestseller, is_new) VALUES
(
  'Baby Bunny Lovey Crochet Pattern PDF',
  'baby-bunny-lovey',
  'Create an adorable bunny lovey that babies will cherish. This pattern includes step-by-step instructions with over 40 photos to guide you through every stitch.',
  '12-page PDF pattern, 40+ step-by-step photos, Materials list, Abbreviations guide, Video tutorial link',
  'Worsted weight yarn (50g main color, 20g accent), 3.5mm crochet hook, Safety eyes (optional), Fiberfill stuffing, Yarn needle',
  'Finished size: approximately 12" x 12" including ears',
  4.99, NULL,
  (SELECT id FROM categories WHERE slug = 'amigurumi'),
  'Easy', 12,
  ARRAY['/images/products/bunny-1.jpg', '/images/products/bunny-2.jpg'],
  ARRAY['Bunny', 'Baby', 'Lovey', 'Easter', 'Beginner Friendly'],
  true, true, true
),
(
  'Granny Square Tote Bag',
  'granny-square-tote-bag',
  'A stylish and practical tote bag featuring classic granny squares. Perfect for market trips or everyday use.',
  '8-page PDF pattern, Color chart, Assembly diagram',
  'DK weight cotton yarn (400g total), 4mm crochet hook, Lining fabric (optional), Magnetic snap closure',
  'Finished size: 14" wide x 12" tall x 4" deep',
  5.99, NULL,
  (SELECT id FROM categories WHERE slug = 'bags-totes'),
  'Intermediate', 8,
  ARRAY['/images/products/tote-1.jpg'],
  ARRAY['Granny Square', 'Tote', 'Bag', 'Market'],
  true, true, false
),
(
  'Daisy Bucket Hat',
  'daisy-bucket-hat',
  'A cheerful daisy-themed bucket hat perfect for sunny days. Features 3D daisy appliques.',
  '10-page PDF pattern, Daisy applique instructions, Size chart (S/M/L)',
  'Lightweight cotton yarn, 3.5mm crochet hook, Stitch markers',
  'Fits head circumference 21-23"',
  4.99, 3.49,
  (SELECT id FROM categories WHERE slug = 'wearables'),
  'Easy', 10,
  ARRAY['/images/products/hat-1.jpg'],
  ARRAY['Hat', 'Daisy', 'Summer', 'Accessories'],
  false, true, false
),
(
  'Cozy Cardigan Pattern',
  'cozy-cardigan',
  'A warm and stylish cardigan perfect for layering. Available in sizes XS through 3XL.',
  '18-page PDF pattern, Size chart, Video tutorials for key techniques',
  'Aran weight yarn (800-1200g depending on size), 5mm crochet hook, Buttons (5-7)',
  'Sizes XS through 3XL included',
  7.99, NULL,
  (SELECT id FROM categories WHERE slug = 'wearables'),
  'Intermediate', 18,
  ARRAY['/images/products/cardigan-1.jpg'],
  ARRAY['Cardigan', 'Wearable', 'Winter', 'Plus Size'],
  true, false, true
),
(
  'Amigurumi Cat Pattern',
  'amigurumi-cat',
  'An adorable sitting cat amigurumi that makes a perfect gift or desk companion.',
  '6-page PDF pattern, Step-by-step photos',
  'Worsted weight yarn, 3.5mm hook, Safety eyes, Fiberfill',
  'Finished size: 6" tall',
  3.49, NULL,
  (SELECT id FROM categories WHERE slug = 'amigurumi'),
  'Beginner', 6,
  ARRAY['/images/products/cat-1.jpg'],
  ARRAY['Cat', 'Amigurumi', 'Gift', 'Beginner'],
  false, true, false
),
(
  'Sunflower Coaster Set',
  'sunflower-coaster-set',
  'A set of 4 beautiful sunflower coasters. Quick and satisfying project!',
  '4-page PDF pattern, Photo tutorial',
  'Cotton yarn (small amounts), 3mm hook',
  'Each coaster: 4" diameter',
  2.99, NULL,
  (SELECT id FROM categories WHERE slug = 'home-decor'),
  'Beginner', 4,
  ARRAY['/images/products/coaster-1.jpg'],
  ARRAY['Coaster', 'Sunflower', 'Quick Project', 'Gift'],
  false, false, true
);

-- Sample Coupons
INSERT INTO coupons (code, discount_type, value, min_order_amount, is_active) VALUES
  ('WELCOME10', 'percentage', 10, 0, true),
  ('SAVE5', 'fixed', 5.00, 15.00, true);
