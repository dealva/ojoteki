-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID DEFAULT gen_random_uuid() UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  profile_photo VARCHAR(512), -- URL or path to profile photo, nullable
  role VARCHAR(50) NOT NULL, -- 'admin' or 'customer'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  total_price INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'confirmed', 'shipped', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(255), --not use this for now, we use snap_token instead
  order_id INTEGER REFERENCES orders(id),
  payment_method VARCHAR(100),
  paid_at TIMESTAMP,
  status VARCHAR(50), -- 'pending', 'paid', 'failed'
  snap_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(255),
  order_id INTEGER REFERENCES orders(id),
  courier VARCHAR(50), -- e.g., 'JNE', 'TIKI'
  status VARCHAR(50), -- 'waiting', 'in_transit', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation Users
CREATE TABLE IF NOT EXISTS conversation_users (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  conversation_id INTEGER REFERENCES conversations(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  conversation_id INTEGER REFERENCES conversations(id),
  contents TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_product_id ON carts(product_id);

-- Sample admin insert
INSERT INTO users (
  public_id, name, email, password, phone, address, role
) VALUES (
  gen_random_uuid(),
  'Admin-Alfian',
  'alfianyuanata@gmail.com',
  '$2b$10$h3o/LOU.UPwu515rUjjX7O/wLdxL58kh1fTDAkJmnNEq.DfjhfjkK',
  '620000000000',
  'Main Office',
  'admin'
);
