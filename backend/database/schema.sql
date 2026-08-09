-- EliteRank PostgreSQL Database Schema

-- Drop tables if exists for clean initialization
DROP TABLE IF EXISTS views CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS custom_fields CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    icon VARCHAR(100) DEFAULT 'Layers',
    banner_url VARCHAR(500) DEFAULT '',
    item_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Custom Fields Table
CREATE TABLE custom_fields (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    field_name VARCHAR(255) NOT NULL,
    field_key VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) DEFAULT 'text' CHECK (field_type IN ('text', 'number', 'currency', 'date', 'select', 'url', 'image')),
    is_required BOOLEAN DEFAULT FALSE,
    options JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, field_key)
);

-- Items Table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    rank INT NOT NULL DEFAULT 1,
    views_count INT DEFAULT 0,
    country VARCHAR(100) DEFAULT '',
    custom_values JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, slug)
);

-- Favorites Table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- Views Tracking Table
CREATE TABLE views (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    ip_address VARCHAR(100) DEFAULT '',
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings Table
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for maximum query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_custom_fields_category ON custom_fields(category_id);
CREATE INDEX idx_items_category_rank ON items(category_id, rank);
CREATE INDEX idx_items_slug ON items(slug);
CREATE INDEX idx_items_country ON items(country);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_views_item ON views(item_id);
