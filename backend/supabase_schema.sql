-- ================================================================
-- Smart Lost & Found System — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- Items table (stores both found and lost item reports)
CREATE TABLE IF NOT EXISTS items (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL CHECK (category IN ('Electronics','Accessories','Clothing','Documents','Keys','Other')),
    location    TEXT NOT NULL,
    item_type   TEXT NOT NULL CHECK (item_type IN ('found','lost')),
    description TEXT DEFAULT '',
    color       TEXT DEFAULT '',
    contact     TEXT DEFAULT '',
    shelf_tag   TEXT DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Claimed','Returned')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (keep data safe)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can see found items)
CREATE POLICY "Public read" ON items
    FOR SELECT USING (true);

-- Allow public insert (anyone can report an item)
CREATE POLICY "Public insert" ON items
    FOR INSERT WITH CHECK (true);

-- Allow updates (for admin status changes)
CREATE POLICY "Public update" ON items
    FOR UPDATE USING (true);

-- ── Sample data (optional — delete if you want a clean start) ──────────────
INSERT INTO items (name, category, location, item_type, description, color, shelf_tag, status) VALUES
('Apple AirPods Pro',    'Electronics',  'Library (Building 2)',   'found', 'White case with small scratch', 'White',  'A-04', 'Active'),
('Black leather wallet', 'Accessories',  'Student Hub',            'found', 'Contains some cards, no cash',  'Black',  'B-12', 'Active'),
('JCU Hoodie — size M',  'Clothing',     'Lecture Theatre A',      'found', 'Dark blue, JCU logo on front',  'Blue',   'C-02', 'Active'),
('Samsung Galaxy S25',   'Electronics',  'Cafeteria',              'found', 'Black phone, cracked screen',   'Black',  'A-07', 'Claimed'),
('Student ID card',      'Documents',    'Library (Building 2)',   'found', 'Name partially visible',        '',       'D-01', 'Active'),
('Nike running cap',     'Clothing',     'Sports complex',         'found', 'Red and black, size L',         'Red',    'C-08', 'Active'),
('MacBook Pro 14"',      'Electronics',  'Lecture Theatre B',      'found', 'Space grey, sticker on lid',    'Grey',   'A-01', 'Claimed'),
('Blue umbrella',        'Accessories',  'Car park',               'found', 'Foldable, blue handle',         'Blue',   '',     'Returned');
