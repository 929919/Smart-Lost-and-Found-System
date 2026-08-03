-- ============================================================================
-- Smart Lost & Found System — Supabase (PostgreSQL) schema
-- Run this in:  Supabase Dashboard → SQL Editor → New query → paste → Run
-- ============================================================================

-- ---------- ITEMS (found & lost reports) ----------
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
    photo_url   TEXT DEFAULT '',
    reported_by TEXT DEFAULT '',          -- JCU ID of the student who reported a lost item
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- CLAIMS (student claims on found items) ----------
CREATE TABLE IF NOT EXISTS claims (
    id              BIGSERIAL PRIMARY KEY,
    item_id         BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    claimant_jcu_id TEXT NOT NULL,
    proof           TEXT NOT NULL DEFAULT '',
    contact         TEXT DEFAULT '',
    status          TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected','Returned')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- Row-Level Security ----------
-- Prototype uses open, password-less access, so we allow the public (anon) role
-- to read and write. (In production you would restrict writes to authenticated
-- admins — noted as a scope decision in the docs.)
ALTER TABLE items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read items"    ON items  FOR SELECT USING (true);
CREATE POLICY "public insert items"  ON items  FOR INSERT WITH CHECK (true);
CREATE POLICY "public update items"  ON items  FOR UPDATE USING (true);

CREATE POLICY "public read claims"   ON claims FOR SELECT USING (true);
CREATE POLICY "public insert claims" ON claims FOR INSERT WITH CHECK (true);
CREATE POLICY "public update claims" ON claims FOR UPDATE USING (true);

-- NOTE: no DELETE policy is defined on either table, by design. With RLS
-- enabled, any DELETE from the browser is silently rejected (it reports
-- success but removes 0 rows), so item and claim history cannot be destroyed
-- from the client. Records are retired by setting status, never deleted.

-- ---------- Seed data (matches the app's demo data) ----------
INSERT INTO items (name, category, location, item_type, description, color, shelf_tag, status, created_at) VALUES
('Apple AirPods Pro',          'Electronics', 'Library',               'found', 'White case with a small scratch', 'White', 'A-04', 'Active',   '2026-05-28'),
('Black leather wallet',       'Accessories', 'Food Court / Canteen',  'found', 'Contains some cards, no cash',    'Black', 'B-12', 'Active',   '2026-05-29'),
('JCU Hoodie — size M',        'Clothing',    'Lecture Theatres',      'found', 'Dark blue, JCU logo on front',    'Blue',  'C-02', 'Active',   '2026-05-30'),
('Samsung Galaxy S25',         'Electronics', 'Food Court / Canteen',  'found', 'Black phone, cracked screen',     'Black', 'A-07', 'Claimed',  '2026-05-25'),
('Student ID card',            'Documents',   'Main Entrance & Atrium','found', 'Name partially visible',          '',      'D-01', 'Active',   '2026-05-31'),
('Nike running cap',           'Clothing',    'Sports Courts',         'found', 'Red and black, size L',           'Red',   'C-08', 'Active',   '2026-06-01'),
('MacBook Pro 14"',            'Electronics', 'Lecture Theatres',      'found', 'Space grey, sticker on lid',      'Grey',  'A-01', 'Claimed',  '2026-05-22'),
('Blue umbrella',              'Accessories', 'Car Park',              'found', 'Foldable, blue handle',           'Blue',  '',     'Returned', '2026-05-20'),
('Set of car keys',            'Keys',        'Car Park',              'found', 'Toyota key with a red tag',       '',      'E-03', 'Active',   '2026-06-02'),
('Water bottle (Frank Green)', 'Other',       'Sports Field',          'found', 'Mint green, 1L insulated',        'Green', 'F-05', 'Active',   '2026-06-02');

INSERT INTO claims (item_id, claimant_jcu_id, proof, contact, status, created_at, updated_at) VALUES
(2, 'jc123456', 'It''s my wallet — brown stitching inside and my student concession card is in the front slot.', 'jc123456@my.jcu.edu.au', 'Pending',  '2026-06-03', '2026-06-03'),
(4, 'jc222333', 'Cracked top-right corner, lock screen is a photo of a husky. IMEI ends 7741.',                   'jc222333@my.jcu.edu.au', 'Approved', '2026-05-26', '2026-05-27');
