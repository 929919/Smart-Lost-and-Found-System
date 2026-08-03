-- ============================================================================
-- Migration: add items.reported_by
-- Run this ONLY if you already ran schema.sql before this column existed.
-- (A fresh run of schema.sql already includes it.)
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- ============================================================================

ALTER TABLE items ADD COLUMN IF NOT EXISTS reported_by TEXT DEFAULT '';
