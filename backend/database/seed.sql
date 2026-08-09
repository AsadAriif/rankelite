-- Seed Initial Data for EliteRank

-- Seed Admin and User
-- Passwords: Admin123! (hash generated with bcrypt cost 10)
INSERT INTO users (name, email, password_hash, role, avatar) VALUES
('Admin User', 'admin@eliterank.com', '$2a$10$e/3g6oW1uGvh7N/RzM82c.f6wKx/S5f3QW3eT6Y4Z2N0M8L7K6J5i', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
('John Doe', 'user@eliterank.com', '$2a$10$e/3g6oW1uGvh7N/RzM82c.f6wKx/S5f3QW3eT6Y4Z2N0M8L7K6J5i', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');

-- Seed Site Settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'EliteRank'),
('site_tagline', 'The Definitive Global Luxury & Excellence Rankings'),
('hero_title', 'Curated Global Power, Wealth & Excellence'),
('hero_subtitle', 'Explore real-time data-driven rankings of world leaders, hypercars, tech innovations, premier institutions, and iconic brands.'),
('contact_email', 'concierge@eliterank.com'),
('featured_categories_count', '6');

-- Seed Categories
INSERT INTO categories (id, name, slug, description, icon, banner_url, item_count) VALUES
(1, 'Billionaires', 'billionaires', 'The world real-time wealthiest individuals ranked by net worth, source of wealth, and global impact.', 'Crown', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80', 5),
(2, 'Supercars', 'supercars', 'Ultra-exclusive hypercars ranked by horsepower, top speed, engineering perfection, and valuation.', 'Car', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 5),
(3, 'Smartphones', 'smartphones', 'Flagship smartphones evaluated by benchmark performance, camera technology, and design excellence.', 'Smartphone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', 5),
(4, 'Universities', 'universities', 'Top global academic and research institutions ranked by global reputation, alumni achievements, and faculty excellence.', 'GraduationCap', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 5),
(5, 'Airlines', 'airlines', 'World-class premier airlines evaluated by luxury first-class suites, service quality, and global safety standards.', 'Plane', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', 4),
(6, 'Tech Companies', 'tech-companies', 'The world largest technology giants measured by market capitalization, innovation, and global scale.', 'Cpu', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80', 4),
(7, 'Luxury Hotels', 'luxury-hotels', 'Exquisite 5-star & 7-star resorts offering unparalleled hospitality, bespoke suites, and fine dining.', 'Hotel', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 4),
(8, 'Football Clubs', 'football-clubs', 'Premier football powerhouses ranked by UEFA coefficient, financial valuation, and trophy lineage.', 'Trophy', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80', 4);

-- Reset sequence for categories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Seed Custom Fields for Category 1 (Billionaires)
INSERT INTO custom_fields (category_id, field_name, field_key, field_type, is_required) VALUES
(1, 'Net Worth ($B)', 'net_worth', 'currency', true),
(1, 'Source of Income', 'source_of_income', 'text', true),
(1, 'Country', 'country', 'text', true),
(1, 'Age', 'age', 'number', false),
(1, 'Company / Group', 'company', 'text', false);

-- Seed Custom Fields for Category 2 (Supercars)
INSERT INTO custom_fields (category_id, field_name, field_key, field_type, is_required) VALUES
(2, 'Price ($)', 'price', 'currency', true),
(2, 'Horsepower (HP)', 'horsepower', 'number', true),
(2, 'Top Speed (km/h)', 'top_speed', 'number', true),
(2, '0-100 km/h (s)', 'acceleration', 'number', false),
(2, 'Engine Type', 'engine', 'text', true),
(2, 'Manufacturer', 'brand', 'text', true);

-- Seed Custom Fields for Category 3 (Smartphones)
INSERT INTO custom_fields (category_id, field_name, field_key, field_type, is_required) VALUES
(3, 'Price ($)', 'price', 'currency', true),
(3, 'Processor', 'processor', 'text', true),
(3, 'RAM', 'ram', 'text', true),
(3, 'Storage', 'storage', 'text', true),
(3, 'Camera System', 'camera', 'text', true),
(3, 'Battery (mAh)', 'battery', 'number', false);

-- Seed Custom Fields for Category 4 (Universities)
INSERT INTO custom_fields (category_id, field_name, field_key, field_type, is_required) VALUES
(4, 'Country', 'country', 'text', true),
(4, 'Founded Year', 'founded', 'number', true),
(4, 'Acceptance Rate (%)', 'acceptance_rate', 'number', false),
(4, 'Student Population', 'students', 'number', false),
(4, 'Website', 'website', 'url', false);

-- Seed Items for Billionaires
INSERT INTO items (category_id, title, slug, description, image_url, rank, views_count, country, custom_values, status) VALUES
(1, 'Elon Musk', 'elon-musk', 'CEO of Tesla, SpaceX, xAI, and owner of X (formerly Twitter). Renowned for pioneering commercial space travel and electric vehicles.', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80', 1, 14250, 'United States', '{"net_worth": 240.5, "source_of_income": "Tesla, SpaceX", "country": "United States", "age": 52, "company": "Tesla / SpaceX"}'::jsonb, 'active'),
(1, 'Bernard Arnault & Family', 'bernard-arnault', 'Chairman and CEO of LVMH Moët Hennessy Louis Vuitton, the global luxury goods empire encompassing 75 iconic brands.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 2, 9820, 'France', '{"net_worth": 210.2, "source_of_income": "LVMH Luxury Empire", "country": "France", "age": 75, "company": "LVMH"}'::jsonb, 'active'),
(1, 'Jeff Bezos', 'jeff-bezos', 'Founder and Executive Chairman of Amazon, founder of Blue Origin aerospace, and owner of The Washington Post.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80', 3, 8540, 'United States', '{"net_worth": 198.4, "source_of_income": "Amazon, Blue Origin", "country": "United States", "age": 60, "company": "Amazon"}'::jsonb, 'active'),
(1, 'Mark Zuckerberg', 'mark-zuckerberg', 'Founder, Chairman, and CEO of Meta Platforms (Facebook, Instagram, WhatsApp), driving spatial computing and AI.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', 4, 7120, 'United States', '{"net_worth": 177.0, "source_of_income": "Meta Platforms", "country": "United States", "age": 40, "company": "Meta"}'::jsonb, 'active'),
(1, 'Warren Buffett', 'warren-buffett', 'Known as the Oracle of Omaha, CEO of Berkshire Hathaway and one of the most successful investors in history.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 5, 6300, 'United States', '{"net_worth": 133.0, "source_of_income": "Berkshire Hathaway", "country": "United States", "age": 93, "company": "Berkshire Hathaway"}'::jsonb, 'active');

-- Seed Items for Supercars
INSERT INTO items (category_id, title, slug, description, image_url, rank, views_count, country, custom_values, status) VALUES
(2, 'Bugatti Tourbillon', 'bugatti-tourbillon', 'An engineering masterpiece featuring an all-new naturally aspirated 8.3L V16 engine co-developed with Cosworth alongside 3 electric motors.', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', 1, 18400, 'France', '{"price": 4100000, "horsepower": 1800, "top_speed": 445, "acceleration": 2.0, "engine": "8.3L V16 Hybrid", "brand": "Bugatti"}'::jsonb, 'active'),
(2, 'Koenigsegg Jesko Absolut', 'koenigsegg-jesko-absolut', 'Designed to achieve unprecedented land speeds with a drag coefficient of just 0.278 Cd powered by a twin-turbo V8.', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80', 2, 14200, 'Sweden', '{"price": 3400000, "horsepower": 1600, "top_speed": 531, "acceleration": 2.5, "engine": "5.0L Twin-Turbo V8", "brand": "Koenigsegg"}'::jsonb, 'active'),
(2, 'Ferrari SF90 XX Stradale', 'ferrari-sf90-xx-stradale', 'The ultimate track-focused road-legal Ferrari hybrid featuring 1,030 cv and active aerodynamics derived from motorsport racing.', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', 3, 11500, 'Italy', '{"price": 890000, "horsepower": 1030, "top_speed": 340, "acceleration": 2.3, "engine": "4.0L Twin-Turbo V8 Hybrid", "brand": "Ferrari"}'::jsonb, 'active'),
(2, 'McLaren Speedtail', 'mclaren-speedtail', 'McLaren hyper-GT with a central driving position, carbon-fiber bodywork, and futuristic aero-titanium wheels.', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', 4, 9400, 'United Kingdom', '{"price": 2200000, "horsepower": 1035, "top_speed": 403, "acceleration": 2.9, "engine": "4.0L Twin-Turbo V8 Hybrid", "brand": "McLaren"}'::jsonb, 'active'),
(2, 'Pagani Utopia', 'pagani-utopia', 'Handcrafted Italian hypercar prioritizing analog driver connection, lightweight carbo-titanium chassis, and a bespoke AMG V12.', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', 5, 8100, 'Italy', '{"price": 2500000, "horsepower": 864, "top_speed": 354, "acceleration": 2.8, "engine": "6.0L Twin-Turbo V12", "brand": "Pagani"}'::jsonb, 'active');

-- Seed Items for Smartphones
INSERT INTO items (category_id, title, slug, description, image_url, rank, views_count, country, custom_values, status) VALUES
(3, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Aerospace-grade titanium construction, A17 Pro 3nm chip, 5x optical zoom tetraprism lens, and customizable Action Button.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', 1, 21000, 'United States', '{"price": 1199, "processor": "Apple A17 Pro (3nm)", "ram": "8 GB", "storage": "256GB / 512GB / 1TB", "camera": "48MP Main + 12MP Telephoto + 12MP UltraWide", "battery": 4422}'::jsonb, 'active'),
(3, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Built-in S Pen, Titanium frame, Snapdragon 8 Gen 3 for Galaxy, Galaxy AI suite, and 200MP Quad Telephoto Camera.', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', 2, 19500, 'South Korea', '{"price": 1299, "processor": "Snapdragon 8 Gen 3", "ram": "12 GB", "storage": "256GB / 512GB / 1TB", "camera": "200MP Main + 50MP Periscope + 10MP Tele + 12MP UW", "battery": 5000}'::jsonb, 'active'),
(3, 'Google Pixel 8 Pro', 'google-pixel-8-pro', 'Google Tensor G3 AI processor, Super Actua display, Pro camera controls, and 7 years of Android OS updates.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', 3, 12400, 'United States', '{"price": 999, "processor": "Google Tensor G3", "ram": "12 GB", "storage": "128GB / 256GB / 512GB / 1TB", "camera": "50MP Main + 48MP Telephoto + 48MP UltraWide", "battery": 5050}'::jsonb, 'active'),
(3, 'Xiaomi 14 Ultra', 'xiaomi-14-ultra', 'Leica quad camera system with 1-inch LYT-900 sensor, stepless variable aperture f/1.63-f/4.0, and 90W HyperCharge.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', 4, 8900, 'China', '{"price": 1499, "processor": "Snapdragon 8 Gen 3", "ram": "16 GB", "storage": "512GB", "camera": "Leica Quad 50MP 1-inch Sensor", "battery": 5000}'::jsonb, 'active'),
(3, 'OnePlus 12', 'oneplus-12', 'Snapdragon 8 Gen 3, Hasselblad 4th Gen Camera for Mobile, 2K 120Hz ProXDR display, and 100W SUPERVOOC charging.', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', 5, 7600, 'China', '{"price": 799, "processor": "Snapdragon 8 Gen 3", "ram": "12 GB / 16 GB", "storage": "256GB / 512GB", "camera": "50MP Sony LYT-808 + 64MP Periscope + 48MP UW", "battery": 5400}'::jsonb, 'active');

-- Seed Items for Universities
INSERT INTO items (category_id, title, slug, description, image_url, rank, views_count, country, custom_values, status) VALUES
(4, 'Harvard University', 'harvard-university', 'Founded in 1636, Harvard is the oldest institution of higher learning in the United States, producing world leaders and Nobel laureates.', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', 1, 15600, 'United States', '{"country": "United States", "founded": 1636, "acceptance_rate": 3.4, "students": 23000, "website": "https://harvard.edu"}'::jsonb, 'active'),
(4, 'University of Cambridge', 'university-of-cambridge', 'A collegiate research university in Cambridge, England, renowned for ground-breaking scientific breakthroughs over eight centuries.', 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80', 2, 13100, 'United Kingdom', '{"country": "United Kingdom", "founded": 1209, "acceptance_rate": 18.0, "students": 24000, "website": "https://cam.ac.uk"}'::jsonb, 'active'),
(4, 'Stanford University', 'stanford-university', 'Located in Silicon Valley, Stanford is famous for entrepreneurial culture, technological pioneering, and elite athletics.', 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80', 3, 12900, 'United States', '{"country": "United States", "founded": 1885, "acceptance_rate": 3.9, "students": 17000, "website": "https://stanford.edu"}'::jsonb, 'active'),
(4, 'MIT (Massachusetts Institute of Technology)', 'mit', 'A world leader in science, engineering, artificial intelligence, and cutting-edge technological research.', 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80', 4, 11800, 'United States', '{"country": "United States", "founded": 1861, "acceptance_rate": 4.0, "students": 11900, "website": "https://mit.edu"}'::jsonb, 'active'),
(4, 'University of Oxford', 'university-of-oxford', 'The oldest university in the English-speaking world, holding unmatched academic prestige across humanities and sciences.', 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=800&q=80', 5, 11200, 'United Kingdom', '{"country": "United Kingdom", "founded": 1096, "acceptance_rate": 14.5, "students": 26000, "website": "https://ox.ac.uk"}'::jsonb, 'active');

-- Seed Favorites for Sample User
INSERT INTO favorites (user_id, item_id) VALUES
(2, 1),
(2, 6),
(2, 11);
